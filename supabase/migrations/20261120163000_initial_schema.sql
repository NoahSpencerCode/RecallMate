-- RecallMate schema: study packs (shared, read-only content), each user's
-- memories (cards), and their review history.
--
-- Scheduling works in calendar days in the user's own timezone: the app sends
-- its local date ("p_today") and the server stores dates, never timestamps,
-- for due dates. A card due on a day is reviewable for that whole day.
--
-- Intervals follow the Fibonacci sequence. A new card is due 1 day after it is
-- created; after each successful review the next gap is 1, 2, 3, 5, 8, 13...
-- days. A failed review resets the card to stage 0, due tomorrow.

-- ---------------------------------------------------------------------------
-- Study packs: content shipped by RecallMate, readable by everyone.
-- ---------------------------------------------------------------------------

create table public.pack_categories (
  id text primary key check (id ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  name text not null,
  tagline text not null,
  position int not null default 0
);

create table public.packs (
  id text primary key check (id ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  category_id text not null references public.pack_categories (id) on delete cascade,
  title text not null,
  course text not null,
  description text not null,
  position int not null default 0
);

create index packs_category_position_idx on public.packs (category_id, position);

create table public.pack_cards (
  id text primary key, -- "<pack id>/<card id>"
  pack_id text not null references public.packs (id) on delete cascade,
  position int not null,
  title text not null,
  body text not null,
  answer text,
  accepted_answers text[] not null default '{}'
);

create index pack_cards_pack_position_idx on public.pack_cards (pack_id, position);

-- ---------------------------------------------------------------------------
-- Memories: a user's cards, written by them or copied from a pack.
-- ---------------------------------------------------------------------------

create table public.memories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  title text not null check (char_length(btrim(title)) between 1 and 200),
  body text not null default '' check (char_length(body) <= 5000),
  answer text check (answer is null or char_length(btrim(answer)) between 1 and 200),
  accepted_answers text[] not null default '{}',
  pack_id text references public.packs (id) on delete set null,
  pack_card_id text references public.pack_cards (id) on delete set null,
  stage int not null default 0 check (stage >= 0),
  due_on date not null,
  last_reviewed_on date,
  review_count int not null default 0 check (review_count >= 0),
  lapse_count int not null default 0 check (lapse_count >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint memories_user_pack_card_key unique (user_id, pack_card_id)
);

create index memories_user_due_idx on public.memories (user_id, due_on);
create index memories_user_pack_idx on public.memories (user_id, pack_id) where pack_id is not null;
create index memories_pack_card_idx on public.memories (pack_card_id) where pack_card_id is not null;

create function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger memories_set_updated_at
  before update on public.memories
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Reviews: one row per completed review, used for streaks and stats.
-- Rows survive the memory being deleted so streaks don't silently shrink.
-- ---------------------------------------------------------------------------

create table public.reviews (
  id bigint generated always as identity primary key,
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  memory_id uuid references public.memories (id) on delete set null,
  reviewed_on date not null,
  reviewed_at timestamptz not null default now(),
  passed boolean not null,
  attempts smallint not null default 1 check (attempts between 0 and 10)
);

create index reviews_user_day_idx on public.reviews (user_id, reviewed_on);
create index reviews_memory_idx on public.reviews (memory_id) where memory_id is not null;

-- ---------------------------------------------------------------------------
-- Row Level Security: packs are public; memories and reviews are private.
-- ---------------------------------------------------------------------------

alter table public.pack_categories enable row level security;
alter table public.packs enable row level security;
alter table public.pack_cards enable row level security;
alter table public.memories enable row level security;
alter table public.reviews enable row level security;

create policy "Pack categories are readable by everyone"
  on public.pack_categories for select to anon, authenticated using (true);

create policy "Packs are readable by everyone"
  on public.packs for select to anon, authenticated using (true);

create policy "Pack cards are readable by everyone"
  on public.pack_cards for select to anon, authenticated using (true);

create policy "Users can read their own memories"
  on public.memories for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can create their own memories"
  on public.memories for insert to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Users can update their own memories"
  on public.memories for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "Users can delete their own memories"
  on public.memories for delete to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can read their own reviews"
  on public.reviews for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can log their own reviews"
  on public.reviews for insert to authenticated
  with check ((select auth.uid()) = user_id);

-- ---------------------------------------------------------------------------
-- Scheduling helpers and RPCs. All run as the caller (security invoker), so
-- Row Level Security applies inside them too.
-- ---------------------------------------------------------------------------

-- fib(1) = 1, fib(2) = 1, fib(3) = 2, fib(4) = 3, fib(5) = 5 ...
create function public.fib(n int)
returns bigint
language plpgsql
immutable
strict
set search_path = ''
as $$
declare
  a bigint := 0;
  b bigint := 1;
begin
  if n <= 0 then
    return 0;
  end if;
  for i in 2..least(n, 90) loop
    select b, a + b into a, b;
  end loop;
  return b;
end;
$$;

-- Rejects dates that can't be the caller's local "today" (UTC-12 .. UTC+14).
create function public.assert_local_today(p_today date)
returns void
language plpgsql
stable
set search_path = ''
as $$
declare
  utc_today date := (now() at time zone 'utc')::date;
begin
  if p_today is null or p_today < utc_today - 1 or p_today > utc_today + 1 then
    raise exception 'p_today must be the caller''s local date'
      using errcode = '22023';
  end if;
end;
$$;

-- Records a review and schedules the card's next due date.
create function public.review_memory(
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
  next_stage int;
  gap_days int;
begin
  perform public.assert_local_today(p_today);

  select * into m from public.memories where id = p_memory_id for update;
  if not found then
    raise exception 'Memory % not found', p_memory_id using errcode = 'P0002';
  end if;
  if m.due_on > p_today then
    raise exception 'Memory is not due until %', m.due_on using errcode = '22023';
  end if;

  if p_passed then
    next_stage := m.stage + 1;
    gap_days := least(public.fib(next_stage + 1), 3650)::int;
  else
    next_stage := 0;
    gap_days := 1;
  end if;

  update public.memories
     set stage = next_stage,
         due_on = p_today + gap_days,
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

-- Copies a pack's cards into the caller's memories, introducing p_per_day new
-- cards per day starting today (p_per_day <= 0 or null adds them all today).
-- Cards the caller already has from this pack are skipped. Returns the number
-- of cards added.
create function public.add_pack(p_pack_id text, p_today date, p_per_day int default 5)
returns int
language plpgsql
security invoker
set search_path = ''
as $$
declare
  per_day int := case when p_per_day is null or p_per_day <= 0 then 10000 else p_per_day end;
  added int;
begin
  if (select auth.uid()) is null then
    raise exception 'You need to be signed in to add a pack' using errcode = '42501';
  end if;
  perform public.assert_local_today(p_today);
  if not exists (select 1 from public.packs where id = p_pack_id) then
    raise exception 'Pack % not found', p_pack_id using errcode = 'P0002';
  end if;

  -- created_at is staggered by a millisecond per card so reviews keep the
  -- pack's teaching order (memories are listed by due date, then created_at).
  insert into public.memories
    (user_id, title, body, answer, accepted_answers, pack_id, pack_card_id, due_on, created_at)
  select (select auth.uid()), c.title, c.body, c.answer, c.accepted_answers, c.pack_id, c.id,
         p_today + ((row_number() over (order by c.position) - 1) / per_day)::int,
         now() + (row_number() over (order by c.position)) * interval '1 millisecond'
    from public.pack_cards c
   where c.pack_id = p_pack_id
     and not exists (
       select 1 from public.memories m
        where m.user_id = (select auth.uid()) and m.pack_card_id = c.id
     )
  on conflict (user_id, pack_card_id) do nothing;

  get diagnostics added = row_count;
  return added;
end;
$$;

-- Streaks, today's numbers, 12 weeks of activity and a 7-day forecast.
-- A card is "mastered" once it has passed 5 reviews in a row (8+ day gaps).
create function public.get_progress(p_today date)
returns jsonb
language sql
stable
security invoker
set search_path = ''
as $$
  with my_days as (
    select reviewed_on,
           count(*)::int as reviews,
           count(*) filter (where passed)::int as passed
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
  )
  select jsonb_build_object(
    'current_streak', coalesce(
      (select len from runs where last_day >= p_today - 1 order by last_day desc limit 1), 0),
    'best_streak', coalesce((select max(len) from runs), 0),
    'reviewed_today', coalesce((select reviews from my_days where reviewed_on = p_today), 0),
    'total_reviews', coalesce((select sum(reviews) from my_days), 0),
    'accuracy_30d', (
      select case when sum(reviews) > 0 then round(sum(passed)::numeric / sum(reviews), 3) end
        from my_days where reviewed_on > p_today - 30),
    'memories', (select to_jsonb(mem) from mem),
    'activity', coalesce((
      select jsonb_agg(jsonb_build_object('day', reviewed_on, 'count', reviews) order by reviewed_on)
        from my_days where reviewed_on > p_today - 84), '[]'::jsonb),
    'forecast', (
      select jsonb_agg(jsonb_build_object('day', d, 'count', (
               select count(*)::int from public.memories m
                where m.user_id = (select auth.uid())
                  and case when d = p_today then m.due_on <= d else m.due_on = d end
             )) order by d)
        from (select (p_today + i) as d from generate_series(0, 6) as i) as days)
  );
$$;

-- Per-pack progress for the caller (RLS applies through security_invoker).
create view public.my_pack_progress
with (security_invoker = true) as
select pack_id,
       count(*)::int as card_count,
       count(*) filter (where review_count > 0)::int as started_count,
       count(*) filter (where stage >= 5)::int as mastered_count
  from public.memories
 where pack_id is not null
 group by pack_id;

-- Lets a signed-in user permanently delete their own account and data
-- (App Store guideline 5.1.1(v)). Runs with elevated rights, so it only ever
-- touches the caller's own row; memories and reviews cascade.
create function public.delete_account()
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if (select auth.uid()) is null then
    raise exception 'You need to be signed in' using errcode = '42501';
  end if;
  delete from auth.users where id = (select auth.uid());
end;
$$;

-- ---------------------------------------------------------------------------
-- Function privileges: only signed-in users may call the RPCs.
-- ---------------------------------------------------------------------------

revoke all on function public.review_memory(uuid, boolean, date, int) from public, anon;
revoke all on function public.add_pack(text, date, int) from public, anon;
revoke all on function public.get_progress(date) from public, anon;
revoke all on function public.delete_account() from public, anon;
revoke all on function public.assert_local_today(date) from public, anon;

grant execute on function public.review_memory(uuid, boolean, date, int) to authenticated;
grant execute on function public.add_pack(text, date, int) to authenticated;
grant execute on function public.get_progress(date) to authenticated;
grant execute on function public.delete_account() to authenticated;
grant execute on function public.assert_local_today(date) to authenticated;
