-- Professions: long, ordered card paths that take a learner from zero to
-- PhD-level knowledge of a field.
--
-- Content (professions, tiers, modules, cards) is stored once and written only
-- by migrations. Each learner keeps a small progress row per card they've
-- opened. Learners can read their own rows; every write goes through the
-- functions below, so the "review what's due before opening more" rule can't
-- be skipped from the API.

-- ---------------------------------------------------------------------------
-- Content
-- ---------------------------------------------------------------------------

create table public.professions (
  id text primary key check (id ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  name text not null check (char_length(btrim(name)) between 1 and 80),
  tagline text not null check (char_length(tagline) <= 200),
  description text not null check (char_length(description) <= 2000),
  -- The look lives here so a new profession needs no code change.
  icon text not null,
  accent text not null check (accent ~ '^#[0-9A-Fa-f]{6}$'),
  gradient text[] not null check (cardinality(gradient) = 2),
  -- The 0 → PhD bar's fixed denominator, from the curriculum's budgets.
  planned_cards int not null check (planned_cards > 0),
  position int not null default 0
);

create table public.profession_tiers (
  profession_id text not null references public.professions (id) on delete cascade,
  tier smallint not null check (tier between 0 and 99),
  slug text not null check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  name text not null,
  -- The label printed on the bar at the end of this tier, if any (e.g. "Bachelor's").
  milestone text,
  summary text not null,
  planned_cards int not null check (planned_cards > 0),
  primary key (profession_id, tier),
  unique (profession_id, slug)
);

create table public.profession_modules (
  -- "<profession>/<module>"
  id text primary key check (id ~ '^[a-z0-9]+(-[a-z0-9]+)*/[a-z0-9]+(-[a-z0-9]+)*$'),
  profession_id text not null references public.professions (id) on delete cascade,
  tier smallint not null,
  position int not null,
  title text not null,
  summary text not null,
  planned_cards int not null check (planned_cards > 0),
  refs text[] not null default '{}',
  -- Hands-on projects: [{ "title": ..., "url": ... }]
  practice jsonb not null default '[]'::jsonb check (jsonb_typeof(practice) = 'array'),
  foreign key (profession_id, tier) references public.profession_tiers (profession_id, tier) on delete cascade
);

create index profession_modules_profession_idx on public.profession_modules (profession_id, position);

create table public.profession_cards (
  -- "<profession>/<card>". Never renamed or reused once live.
  id text primary key check (id ~ '^[a-z0-9]+(-[a-z0-9]+)*/[a-z0-9]+(-[a-z0-9]+)*$'),
  profession_id text not null references public.professions (id) on delete cascade,
  module_id text not null references public.profession_modules (id) on delete cascade,
  -- Teaching order: tier × 1,000,000 + order within the tier, so each tier's
  -- content file stands alone.
  position int not null check (position >= 0),
  kind text not null check (kind in (
    'definition', 'concept', 'theorem', 'proof-idea', 'example', 'counterexample', 'problem',
    'formula', 'code', 'numbers', 'trade-off', 'landmark', 'misconception')),
  difficulty smallint not null check (difficulty between 1 and 10),
  -- Capstone cards, used for placement checks.
  checkpoint boolean not null default false,
  -- The same text fields as pack cards, so the review screen renders both.
  title text not null,
  body text not null,
  answer text check (answer is null or char_length(answer) between 1 and 200),
  accepted_answers text[] not null default '{}',
  answer_display text check (answer_display is null or char_length(answer_display) <= 500),
  search_query text check (search_query is null or char_length(search_query) <= 200),
  refs text[] not null default '{}',
  tags text[] not null default '{}',
  -- When a time-sensitive card was last checked.
  as_of date,
  -- Retired cards leave queues and counts; they're never deleted, so nobody loses history.
  retired boolean not null default false,
  constraint profession_cards_title_length check (
    char_length(btrim(title)) between 1 and (case when kind in ('problem', 'code') then 1500 else 600 end)),
  constraint profession_cards_body_length check (
    char_length(body) <= (case when kind in ('problem', 'code', 'proof-idea') then 5000 else 3000 end))
  -- Positions aren't unique in the database: retired cards keep their old
  -- ones. The content builder keeps live cards' positions unique, and every
  -- query breaks ties by id.
);

create index profession_cards_next_idx on public.profession_cards (profession_id, position) where not retired;
create index profession_cards_module_idx on public.profession_cards (module_id, position);

-- ---------------------------------------------------------------------------
-- Per-learner progress
-- ---------------------------------------------------------------------------

create table public.profession_enrollments (
  user_id uuid not null references auth.users (id) on delete cascade,
  profession_id text not null references public.professions (id) on delete cascade,
  -- Placement: cards before this position were skipped.
  start_position int not null default 0,
  started_at timestamptz not null default now(),
  primary key (user_id, profession_id)
);

create table public.profession_card_states (
  user_id uuid not null references auth.users (id) on delete cascade,
  -- No cascade: a content migration must never delete anyone's progress.
  card_id text not null references public.profession_cards (id),
  profession_id text not null references public.professions (id) on delete cascade,
  stage int not null default 0 check (stage >= 0),
  due_on date not null,
  last_reviewed_on date,
  review_count int not null default 0,
  lapse_count int not null default 0,
  opened_on date not null,
  opened_at timestamptz not null default now(),
  primary key (user_id, card_id)
);

create index profession_card_states_due_idx on public.profession_card_states (user_id, profession_id, due_on);
create index profession_card_states_card_idx on public.profession_card_states (card_id);

create table public.profession_card_reports (
  id bigint generated always as identity primary key,
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  card_id text not null references public.profession_cards (id) on delete cascade,
  reason text not null check (reason in ('wrong', 'unclear', 'typo', 'other')),
  note text check (note is null or char_length(note) <= 1000),
  created_at timestamptz not null default now()
);

create index profession_card_reports_card_idx on public.profession_card_reports (card_id);

-- Profession reviews are logged with memory reviews, so streaks, the heatmap
-- and accuracy count both.
alter table public.reviews
  add column profession_card_id text references public.profession_cards (id) on delete set null,
  add constraint reviews_one_card check (num_nonnulls(memory_id, profession_card_id) <= 1);

create index reviews_profession_card_idx on public.reviews (profession_card_id) where profession_card_id is not null;

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------

alter table public.professions enable row level security;
alter table public.profession_tiers enable row level security;
alter table public.profession_modules enable row level security;
alter table public.profession_cards enable row level security;
alter table public.profession_enrollments enable row level security;
alter table public.profession_card_states enable row level security;
alter table public.profession_card_reports enable row level security;

create policy "Professions are readable by signed-in users"
  on public.professions for select to authenticated using (true);

create policy "Profession tiers are readable by signed-in users"
  on public.profession_tiers for select to authenticated using (true);

create policy "Profession modules are readable by signed-in users"
  on public.profession_modules for select to authenticated using (true);

create policy "Profession cards are readable by signed-in users"
  on public.profession_cards for select to authenticated using (true);

create policy "Users can read their own enrollments"
  on public.profession_enrollments for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can read their own profession progress"
  on public.profession_card_states for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can read their own card reports"
  on public.profession_card_reports for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can report problems with cards"
  on public.profession_card_reports for insert to authenticated
  with check ((select auth.uid()) = user_id);

-- Belt and braces: RLS has no write policies on these, and TRUNCATE ignores RLS.
revoke insert, update, delete, truncate on
  public.professions, public.profession_tiers, public.profession_modules, public.profession_cards,
  public.profession_enrollments, public.profession_card_states
  from anon, authenticated;
revoke update, delete, truncate on public.profession_card_reports from anon, authenticated;
revoke all on
  public.profession_enrollments, public.profession_card_states, public.profession_card_reports
  from anon;

-- ---------------------------------------------------------------------------
-- Scheduling: one Fibonacci rule for memories and profession cards
-- ---------------------------------------------------------------------------

-- A pass moves a card up a stage and waits fib(stage + 2) days (at most ten
-- years); a miss starts it over tomorrow.
create function public.next_schedule(p_stage int, p_passed boolean, out next_stage int, out gap_days int)
language sql
immutable
strict
set search_path = ''
as $$
  select case when p_passed then p_stage + 1 else 0 end,
         case when p_passed then least(public.fib(p_stage + 2), 3650)::int else 1 end;
$$;

-- Same behaviour as before; the rule now lives in next_schedule.
create or replace function public.review_memory(
  p_memory_id uuid,
  p_passed boolean,
  p_today date,
  p_attempts int default 1
)
returns public.memories
language plpgsql
security invoker
set search_path = ''
as $$
declare
  m public.memories;
  sched record;
begin
  perform public.assert_local_today(p_today);

  select * into m from public.memories where id = p_memory_id for update;
  if not found then
    raise exception 'Memory % not found', p_memory_id using errcode = 'P0002';
  end if;
  if m.due_on > p_today then
    raise exception 'Memory is not due until %', m.due_on using errcode = '22023';
  end if;

  select * into sched from public.next_schedule(m.stage, p_passed);

  update public.memories
     set stage = sched.next_stage,
         due_on = p_today + sched.gap_days,
         last_reviewed_on = p_today,
         review_count = review_count + 1,
         lapse_count = lapse_count + (case when p_passed then 0 else 1 end)
   where id = p_memory_id
  returning * into m;

  insert into public.reviews (user_id, memory_id, reviewed_on, passed, attempts)
  values (m.user_id, m.id, p_today, p_passed, least(greatest(coalesce(p_attempts, 1), 0), 10));

  return m;
end;
$$;

-- ---------------------------------------------------------------------------
-- Writers. These run with elevated rights (security definer), so every
-- statement filters on the caller's own user id.
-- ---------------------------------------------------------------------------

-- Starts a profession, or moves its starting point. p_start_tier > 0 skips the
-- earlier tiers (after the placement self-check); moving the start back later
-- brings the skipped cards in next, in order.
create function public.start_profession(p_profession_id text, p_start_tier int default 0)
returns public.profession_enrollments
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid := (select auth.uid());
  v_start int := 0;
  e public.profession_enrollments;
begin
  if v_uid is null then
    raise exception 'You need to be signed in' using errcode = '42501';
  end if;
  if not exists (select 1 from public.professions where id = p_profession_id) then
    raise exception 'Profession % not found', p_profession_id using errcode = 'P0002';
  end if;

  if coalesce(p_start_tier, 0) > 0 then
    select min(c.position) into v_start
      from public.profession_cards c
      join public.profession_modules m on m.id = c.module_id
     where c.profession_id = p_profession_id and m.tier = p_start_tier and not c.retired;
    if v_start is null then
      raise exception 'That tier has no cards yet' using errcode = '22023';
    end if;
  end if;

  insert into public.profession_enrollments (user_id, profession_id, start_position)
  values (v_uid, p_profession_id, v_start)
  on conflict (user_id, profession_id) do update set start_position = excluded.start_position
  returning * into e;
  return e;
end;
$$;

-- Opens the next card into the caller's stack, first due tomorrow. Refuses
-- while any of this profession's cards are due. Returns
--   {"status": "opened", "card": {...}, "opened_today": n}
--   {"status": "reviews_due", "due": n}
--   {"status": "done"}  (every released card is already open)
create function public.open_next_profession_card(p_profession_id text, p_today date)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid := (select auth.uid());
  e public.profession_enrollments;
  v_due int;
  c public.profession_cards;
  v_opened_today int;
begin
  if v_uid is null then
    raise exception 'You need to be signed in' using errcode = '42501';
  end if;
  perform public.assert_local_today(p_today);

  -- Locking the enrolment serialises double taps and placement changes.
  select * into e
    from public.profession_enrollments
   where user_id = v_uid and profession_id = p_profession_id
     for update;
  if not found then
    raise exception 'Start this profession first' using errcode = 'P0002';
  end if;

  select count(*) into v_due
    from public.profession_card_states s
    join public.profession_cards pc on pc.id = s.card_id
   where s.user_id = v_uid
     and s.profession_id = p_profession_id
     and s.due_on <= p_today
     and not pc.retired;
  if v_due > 0 then
    return jsonb_build_object('status', 'reviews_due', 'due', v_due);
  end if;

  select pc.* into c
    from public.profession_cards pc
   where pc.profession_id = p_profession_id
     and not pc.retired
     and pc.position >= e.start_position
     and not exists (
       select 1 from public.profession_card_states s where s.user_id = v_uid and s.card_id = pc.id)
   order by pc.position, pc.id
   limit 1;
  if not found then
    return jsonb_build_object('status', 'done');
  end if;

  insert into public.profession_card_states (user_id, card_id, profession_id, stage, due_on, opened_on)
  values (v_uid, c.id, p_profession_id, 0, p_today + 1, p_today);

  select count(*) into v_opened_today
    from public.profession_card_states
   where user_id = v_uid and profession_id = p_profession_id and opened_on = p_today;

  return jsonb_build_object(
    'status', 'opened',
    'opened_today', v_opened_today,
    'card', to_jsonb(c) || jsonb_build_object(
      'stage', 0,
      'module_title', (select m.title from public.profession_modules m where m.id = c.module_id)));
end;
$$;

-- Records a review of a profession card, with the same rules as review_memory.
create function public.review_profession_card(
  p_card_id text,
  p_passed boolean,
  p_today date,
  p_attempts int default 1
)
returns public.profession_card_states
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid := (select auth.uid());
  st public.profession_card_states;
  sched record;
begin
  if v_uid is null then
    raise exception 'You need to be signed in' using errcode = '42501';
  end if;
  perform public.assert_local_today(p_today);

  select * into st
    from public.profession_card_states
   where user_id = v_uid and card_id = p_card_id
     for update;
  if not found then
    raise exception 'Card % is not in your stack', p_card_id using errcode = 'P0002';
  end if;
  if st.due_on > p_today then
    raise exception 'Card is not due until %', st.due_on using errcode = '22023';
  end if;

  select * into sched from public.next_schedule(st.stage, p_passed);

  update public.profession_card_states
     set stage = sched.next_stage,
         due_on = p_today + sched.gap_days,
         last_reviewed_on = p_today,
         review_count = review_count + 1,
         lapse_count = lapse_count + (case when p_passed then 0 else 1 end)
   where user_id = v_uid and card_id = p_card_id
  returning * into st;

  insert into public.reviews (user_id, profession_card_id, reviewed_on, passed, attempts)
  values (v_uid, p_card_id, p_today, p_passed, least(greatest(coalesce(p_attempts, 1), 0), 10));

  return st;
end;
$$;

-- Clears the caller's stack and starting point for one profession. Review
-- history (and so streaks) stays.
create function public.reset_profession(p_profession_id text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid := (select auth.uid());
begin
  if v_uid is null then
    raise exception 'You need to be signed in' using errcode = '42501';
  end if;
  delete from public.profession_card_states where user_id = v_uid and profession_id = p_profession_id;
  delete from public.profession_enrollments where user_id = v_uid and profession_id = p_profession_id;
end;
$$;

-- ---------------------------------------------------------------------------
-- Readers. These run as the caller, so Row Level Security applies.
-- ---------------------------------------------------------------------------

-- The caller's due cards for one profession, oldest first, at most 200.
create function public.profession_due_cards(p_profession_id text, p_today date, p_limit int default 200)
returns table (
  id text,
  module_id text,
  module_title text,
  "position" int,
  kind text,
  difficulty smallint,
  title text,
  body text,
  answer text,
  accepted_answers text[],
  answer_display text,
  search_query text,
  refs text[],
  tags text[],
  as_of date,
  stage int,
  due_on date,
  review_count int
)
language sql
stable
security invoker
set search_path = ''
as $$
  select c.id, c.module_id, md.title, c.position, c.kind, c.difficulty,
         c.title, c.body, c.answer, c.accepted_answers, c.answer_display, c.search_query,
         c.refs, c.tags, c.as_of,
         s.stage, s.due_on, s.review_count
    from public.profession_card_states s
    join public.profession_cards c on c.id = s.card_id
    join public.profession_modules md on md.id = c.module_id
   where s.user_id = (select auth.uid())
     and s.profession_id = p_profession_id
     and s.due_on <= p_today
     and not c.retired
   order by s.due_on, c.position, c.id
   limit least(greatest(coalesce(p_limit, 200), 1), 200);
$$;

-- One entry per profession: what it is, and where the caller stands in it.
create function public.get_profession_overview(p_today date)
returns jsonb
language sql
stable
security invoker
set search_path = ''
as $$
  with released as (
    select profession_id, count(*)::int as released
      from public.profession_cards
     where not retired
     group by profession_id
  ),
  mine as (
    select s.profession_id,
           count(*)::int as opened,
           count(*) filter (where s.stage >= 5)::int as mastered,
           count(*) filter (where s.due_on <= p_today)::int as due_today,
           count(*) filter (where s.due_on = p_today + 1)::int as due_tomorrow,
           count(*) filter (where s.opened_on = p_today)::int as opened_today,
           count(*) filter (where s.opened_on > p_today - 14)::int as opened_14d
      from public.profession_card_states s
      join public.profession_cards c on c.id = s.card_id and not c.retired
     where s.user_id = (select auth.uid())
     group by s.profession_id
  )
  select coalesce(jsonb_agg(jsonb_build_object(
           'id', p.id,
           'name', p.name,
           'tagline', p.tagline,
           'description', p.description,
           'icon', p.icon,
           'accent', p.accent,
           'gradient', to_jsonb(p.gradient),
           'planned_cards', p.planned_cards,
           'released_cards', coalesce(r.released, 0),
           'enrolled', e.user_id is not null,
           'started_at', e.started_at,
           'start_position', coalesce(e.start_position, 0),
           'opened', coalesce(m.opened, 0),
           'mastered', coalesce(m.mastered, 0),
           'due_today', coalesce(m.due_today, 0),
           'due_tomorrow', coalesce(m.due_tomorrow, 0),
           'opened_today', coalesce(m.opened_today, 0),
           'opened_14d', coalesce(m.opened_14d, 0),
           'next', (
             select jsonb_build_object(
                      'module_id', c.module_id,
                      'module_title', md.title,
                      'tier', md.tier,
                      -- "Card N": the rank among released cards, not the raw position.
                      'rank', 1 + (select count(*)::int from public.profession_cards c2
                                    where c2.profession_id = p.id and not c2.retired and c2.position < c.position))
               from public.profession_cards c
               join public.profession_modules md on md.id = c.module_id
              where e.user_id is not null
                and c.profession_id = p.id
                and not c.retired
                and c.position >= e.start_position
                and not exists (
                  select 1 from public.profession_card_states s
                   where s.user_id = (select auth.uid()) and s.card_id = c.id)
              order by c.position, c.id
              limit 1)
         ) order by p.position, p.id), '[]'::jsonb)
    from public.professions p
    left join released r on r.profession_id = p.id
    left join public.profession_enrollments e on e.profession_id = p.id and e.user_id = (select auth.uid())
    left join mine m on m.profession_id = p.id;
$$;

-- Tiers and modules of one profession, with the caller's counts in each: the
-- 0 → PhD bar and the curriculum map are drawn from this.
create function public.get_profession_detail(p_profession_id text, p_today date)
returns jsonb
language sql
stable
security invoker
set search_path = ''
as $$
  with start as (
    select coalesce((
      select start_position from public.profession_enrollments
       where user_id = (select auth.uid()) and profession_id = p_profession_id), 0) as pos
  ),
  mods as (
    select md.id, md.tier, md.position, md.title, md.summary, md.planned_cards, md.refs, md.practice,
           count(c.id) filter (where not c.retired)::int as released,
           count(s.card_id) filter (where not c.retired)::int as opened,
           count(s.card_id) filter (where not c.retired and s.stage >= 5)::int as mastered,
           count(s.card_id) filter (where not c.retired and s.due_on <= p_today)::int as due,
           count(c.id) filter (
             where not c.retired and s.card_id is null and c.position < (select pos from start))::int as placed_out
      from public.profession_modules md
      left join public.profession_cards c on c.module_id = md.id
      left join public.profession_card_states s on s.card_id = c.id and s.user_id = (select auth.uid())
     where md.profession_id = p_profession_id
     group by md.id
  )
  select jsonb_build_object(
    'start_position', (select pos from start),
    'tiers', coalesce((
      select jsonb_agg(jsonb_build_object(
               'tier', t.tier,
               'slug', t.slug,
               'name', t.name,
               'milestone', t.milestone,
               'summary', t.summary,
               'planned_cards', t.planned_cards,
               'released', coalesce((select sum(released) from mods where mods.tier = t.tier), 0),
               'opened', coalesce((select sum(opened) from mods where mods.tier = t.tier), 0),
               'mastered', coalesce((select sum(mastered) from mods where mods.tier = t.tier), 0),
               'placed_out', coalesce((select sum(placed_out) from mods where mods.tier = t.tier), 0),
               'modules', coalesce((
                 select jsonb_agg(jsonb_build_object(
                          'id', mods.id,
                          'title', mods.title,
                          'summary', mods.summary,
                          'planned_cards', mods.planned_cards,
                          'refs', to_jsonb(mods.refs),
                          'practice', mods.practice,
                          'released', mods.released,
                          'opened', mods.opened,
                          'mastered', mods.mastered,
                          'due', mods.due,
                          'placed_out', mods.placed_out
                        ) order by mods.position)
                   from mods where mods.tier = t.tier), '[]'::jsonb)
             ) order by t.tier)
        from public.profession_tiers t
       where t.profession_id = p_profession_id), '[]'::jsonb));
$$;

-- Every card of one module, in order, with the caller's progress on each
-- (null stage = not opened yet). A module holds at most a couple of hundred.
create function public.profession_module_cards(p_module_id text)
returns table (
  id text,
  "position" int,
  kind text,
  difficulty smallint,
  checkpoint boolean,
  title text,
  stage int,
  due_on date
)
language sql
stable
security invoker
set search_path = ''
as $$
  select c.id, c.position, c.kind, c.difficulty, c.checkpoint, c.title, s.stage, s.due_on
    from public.profession_cards c
    left join public.profession_card_states s on s.card_id = c.id and s.user_id = (select auth.uid())
   where c.module_id = p_module_id
     and not c.retired
   order by c.position, c.id
   limit 1000;
$$;

-- ---------------------------------------------------------------------------
-- Progress stats now cover profession cards too
-- ---------------------------------------------------------------------------

-- Adds `reviewed_today_memories` (Today's ring compares it with memories due),
-- a `profession_cards` block shaped like `memories`, and a forecast that
-- counts both kinds of card.
create or replace function public.get_progress(p_today date)
returns jsonb
language sql
stable
security invoker
set search_path = ''
as $$
  with my_days as (
    select reviewed_on,
           count(*)::int as reviews,
           count(*) filter (where passed)::int as passed,
           count(*) filter (where profession_card_id is null)::int as memory_reviews
      from public.reviews
     where user_id = (select auth.uid())
     group by reviewed_on
  ),
  islands as (
    select reviewed_on,
           reviewed_on - (row_number() over (order by reviewed_on))::int as grp
      from my_days
  ),
  runs as (
    select max(reviewed_on) as last_day, count(*)::int as len
      from islands
     group by grp
  ),
  mem as (
    select count(*)::int as total,
           count(*) filter (where due_on <= p_today)::int as due_today,
           count(*) filter (where review_count = 0)::int as fresh,
           count(*) filter (where review_count > 0 and stage < 5)::int as learning,
           count(*) filter (where stage >= 5)::int as mastered
      from public.memories
     where user_id = (select auth.uid())
  ),
  prof as (
    select count(*)::int as total,
           count(*) filter (where s.due_on <= p_today)::int as due_today,
           count(*) filter (where s.review_count = 0)::int as fresh,
           count(*) filter (where s.review_count > 0 and s.stage < 5)::int as learning,
           count(*) filter (where s.stage >= 5)::int as mastered
      from public.profession_card_states s
      join public.profession_cards c on c.id = s.card_id and not c.retired
     where s.user_id = (select auth.uid())
  )
  select jsonb_build_object(
    'current_streak', coalesce(
      (select len from runs where last_day >= p_today - 1 order by last_day desc limit 1), 0),
    'best_streak', coalesce((select max(len) from runs), 0),
    'reviewed_today', coalesce((select reviews from my_days where reviewed_on = p_today), 0),
    'reviewed_today_memories', coalesce((select memory_reviews from my_days where reviewed_on = p_today), 0),
    'total_reviews', coalesce((select sum(reviews) from my_days), 0),
    'accuracy_30d', (
      select case when sum(reviews) > 0 then round(sum(passed)::numeric / sum(reviews), 3) end
        from my_days where reviewed_on > p_today - 30),
    'memories', (select to_jsonb(mem) from mem),
    'profession_cards', (select to_jsonb(prof) from prof),
    'activity', coalesce((
      select jsonb_agg(jsonb_build_object('day', reviewed_on, 'count', reviews) order by reviewed_on)
        from my_days where reviewed_on > p_today - 84), '[]'::jsonb),
    'forecast', (
      select jsonb_agg(jsonb_build_object('day', d, 'count', (
               select count(*)::int from public.memories m
                where m.user_id = (select auth.uid())
                  and case when d = p_today then m.due_on <= d else m.due_on = d end
             ) + (
               select count(*)::int
                 from public.profession_card_states s
                 join public.profession_cards c on c.id = s.card_id and not c.retired
                where s.user_id = (select auth.uid())
                  and case when d = p_today then s.due_on <= d else s.due_on = d end
             )) order by d)
        from (select (p_today + i) as d from generate_series(0, 6) as i) as days)
  );
$$;

-- ---------------------------------------------------------------------------
-- Function privileges: only signed-in users may call them
-- ---------------------------------------------------------------------------

revoke all on function public.next_schedule(int, boolean) from public, anon;
revoke all on function public.start_profession(text, int) from public, anon;
revoke all on function public.open_next_profession_card(text, date) from public, anon;
revoke all on function public.review_profession_card(text, boolean, date, int) from public, anon;
revoke all on function public.reset_profession(text) from public, anon;
revoke all on function public.profession_due_cards(text, date, int) from public, anon;
revoke all on function public.get_profession_overview(date) from public, anon;
revoke all on function public.get_profession_detail(text, date) from public, anon;
revoke all on function public.profession_module_cards(text) from public, anon;

-- review_memory runs as the caller, so the caller needs next_schedule too.
grant execute on function public.next_schedule(int, boolean) to authenticated;
grant execute on function public.start_profession(text, int) to authenticated;
grant execute on function public.open_next_profession_card(text, date) to authenticated;
grant execute on function public.review_profession_card(text, boolean, date, int) to authenticated;
grant execute on function public.reset_profession(text) to authenticated;
grant execute on function public.profession_due_cards(text, date, int) to authenticated;
grant execute on function public.get_profession_overview(date) to authenticated;
grant execute on function public.get_profession_detail(text, date) to authenticated;
grant execute on function public.profession_module_cards(text) to authenticated;
