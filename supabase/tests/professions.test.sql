-- Professions: run with `npm run db:test` (supabase test db).
-- Covers the open-next gate and order, placement, scheduling parity with
-- memories, progress stats, Row Level Security, reports and account deletion.
-- Builds its own small profession and rolls everything back.

begin;
create extension if not exists pgtap with schema extensions;

select plan(47);

insert into auth.users (id, email, aud, role, instance_id)
values
  ('cccccccc-cccc-4ccc-8ccc-cccccccccccc', 'c@test.dev', 'authenticated', 'authenticated', '00000000-0000-0000-0000-000000000000'),
  ('dddddddd-dddd-4ddd-8ddd-dddddddddddd', 'd@test.dev', 'authenticated', 'authenticated', '00000000-0000-0000-0000-000000000000');

create function pg_temp.act_as(uid uuid) returns void language sql as $$
  select set_config('request.jwt.claims', json_build_object('sub', uid, 'role', 'authenticated')::text, true);
  set local role authenticated;
$$;

-- A tiny profession: two tiers, four live cards in tier 0 (one retired in the
-- middle), two in tier 1.
insert into public.professions (id, name, tagline, description, icon, accent, gradient, planned_cards, position)
values ('test-prof', 'Test Profession', 'For tests', 'A fixture.', 'school', '#6C4DFF', array['#6C4DFF', '#B44DFF'], 8, 99);
insert into public.profession_tiers (profession_id, tier, slug, name, milestone, summary, planned_cards)
values ('test-prof', 0, 'basics', 'Basics', null, 'You know the basics.', 5),
       ('test-prof', 1, 'advanced', 'Advanced', 'PhD', 'You know it all.', 3);
insert into public.profession_modules (id, profession_id, tier, position, title, summary, planned_cards)
values ('test-prof/intro', 'test-prof', 0, 0, 'Intro', 'Start here.', 5),
       ('test-prof/deep', 'test-prof', 1, 1, 'Deep', 'Go deeper.', 3);
insert into public.profession_cards (id, profession_id, module_id, position, kind, difficulty, checkpoint, title, body, retired)
values
  ('test-prof/c1', 'test-prof', 'test-prof/intro', 0, 'definition', 1, false, 'Card 1?', 'One', false),
  ('test-prof/c2', 'test-prof', 'test-prof/intro', 1, 'definition', 1, false, 'Card 2?', 'Two', false),
  ('test-prof/c3', 'test-prof', 'test-prof/intro', 2, 'example', 2, false, 'Card 3?', 'Three', false),
  ('test-prof/retired', 'test-prof', 'test-prof/intro', 3, 'example', 2, false, 'Gone?', 'Gone', true),
  ('test-prof/c4', 'test-prof', 'test-prof/intro', 4, 'problem', 2, true, 'Card 4?', 'Four', false),
  ('test-prof/d1', 'test-prof', 'test-prof/deep', 1000000, 'theorem', 8, false, 'Deep 1?', 'Deep one', false),
  ('test-prof/d2', 'test-prof', 'test-prof/deep', 1000001, 'theorem', 9, true, 'Deep 2?', 'Deep two', false);

-- ---------------------------------------------------------------- safety
select is(
  (select count(*)::int from pg_tables where schemaname = 'public' and not rowsecurity), 0,
  'every public table has row level security on');

-- ---------------------------------------------------------------- scheduling
select is(
  (select array_agg((public.next_schedule(i, true)).gap_days order by i) from generate_series(0, 10) as i),
  array[1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144],
  'passing stage 0..10 waits 1, 2, 3, 5, 8, 13 … days');
select is((public.next_schedule(30, true)).gap_days, 3650, 'gaps are capped at ten years');
select is(
  (select (public.next_schedule(7, false)).next_stage || '/' || (public.next_schedule(7, false)).gap_days), '0/1',
  'a miss starts over tomorrow');

-- ---------------------------------------------------------------- opening, in order
select pg_temp.act_as('cccccccc-cccc-4ccc-8ccc-cccccccccccc');

select throws_ok($$ select public.open_next_profession_card('test-prof', current_date) $$, 'P0002', null,
  'opening needs an enrolment');
select is((public.start_profession('test-prof', 0)).start_position, 0, 'starting at the beginning');

create temp table opened (n int, result jsonb);
grant all on opened to authenticated;

insert into opened values (1, public.open_next_profession_card('test-prof', current_date));
select is((select result ->> 'status' from opened where n = 1), 'opened', 'the first open succeeds');
select is((select result -> 'card' ->> 'id' from opened where n = 1), 'test-prof/c1', 'and gives the first card');
select is((select result -> 'card' ->> 'stage' from opened where n = 1), '0', 'returned as a new card (stage 0)');
select is((select result -> 'card' ->> 'module_title' from opened where n = 1), 'Intro', 'with its module''s title');
select is((select due_on from public.profession_card_states where card_id = 'test-prof/c1'), current_date + 1,
  'a newly opened card is first due tomorrow');

insert into opened values (2, public.open_next_profession_card('test-prof', current_date));
select is((select result -> 'card' ->> 'id' from opened where n = 2), 'test-prof/c2',
  'opening again (nothing due) gives the next card in order');
select is((select (result ->> 'opened_today')::int from opened where n = 2), 2, 'and counts cards opened today');

select throws_ok(
  $$ insert into public.profession_card_states (user_id, card_id, profession_id, due_on, opened_on)
     values ('cccccccc-cccc-4ccc-8ccc-cccccccccccc', 'test-prof/c3', 'test-prof', current_date, current_date) $$,
  '42501', null, 'learners cannot add cards to their stack directly');
select throws_ok(
  $$ update public.profession_card_states set due_on = current_date + 100 $$,
  '42501', null, 'or reschedule them directly');

-- ---------------------------------------------------------------- the gate
reset role;
update public.profession_card_states set due_on = current_date
 where user_id = 'cccccccc-cccc-4ccc-8ccc-cccccccccccc';
select pg_temp.act_as('cccccccc-cccc-4ccc-8ccc-cccccccccccc');

insert into opened values (3, public.open_next_profession_card('test-prof', current_date));
select is((select result ->> 'status' from opened where n = 3), 'reviews_due', 'opening is refused while cards are due');
select is((select (result ->> 'due')::int from opened where n = 3), 2, 'and says how many');
select is((select count(*)::int from public.profession_due_cards('test-prof', current_date)), 2,
  'both due cards are in the review queue');

select is((public.review_profession_card('test-prof/c1', true, current_date)).stage, 1, 'a pass moves the card up a stage');
select is((select due_on from public.profession_card_states where card_id = 'test-prof/c1'), current_date + 1,
  'and schedules it like a memory (tomorrow after the first pass)');
select throws_ok($$ select public.review_profession_card('test-prof/c1', true, current_date) $$, '22023', null,
  'a card that is not due cannot be reviewed again');
select is((public.review_profession_card('test-prof/c2', false, current_date, 2)).lapse_count, 1, 'a miss counts a lapse');

insert into opened values (4, public.open_next_profession_card('test-prof', current_date));
select is((select result -> 'card' ->> 'id' from opened where n = 4), 'test-prof/c3', 'once reviewed, opening works again');
insert into opened values (5, public.open_next_profession_card('test-prof', current_date));
select is((select result -> 'card' ->> 'id' from opened where n = 5), 'test-prof/c4', 'retired cards are skipped');
insert into opened values (6, public.open_next_profession_card('test-prof', current_date));
insert into opened values (7, public.open_next_profession_card('test-prof', current_date));
select is((select result -> 'card' ->> 'id' from opened where n = 6), 'test-prof/d1', 'the next tier follows the last');
insert into opened values (8, public.open_next_profession_card('test-prof', current_date));
select is((select result ->> 'status' from opened where n = 8), 'done', 'after the last released card: done');

-- ---------------------------------------------------------------- stats
select is((select count(*)::int from public.reviews where profession_card_id is not null), 2,
  'profession reviews are logged with the rest');
select is((public.get_progress(current_date) ->> 'reviewed_today')::int, 2, 'they count toward today''s reviews');
select is((public.get_progress(current_date) ->> 'reviewed_today_memories')::int, 0,
  'but not toward the memory ring');
select is((public.get_progress(current_date) -> 'profession_cards' ->> 'total')::int, 6,
  'progress counts opened profession cards');

create temp table overview as
  select value as p from jsonb_array_elements(public.get_profession_overview(current_date))
   where value ->> 'id' = 'test-prof';
grant select on overview to authenticated;
select is((select (p ->> 'opened')::int from overview), 6, 'the overview counts opened cards');
select is((select (p ->> 'released_cards')::int from overview), 6, 'and released cards, without retired ones');
select is((select (p ->> 'opened_today')::int from overview), 6, 'and cards opened today');

select is(
  (select (t -> 'modules' -> 0 ->> 'opened')::int
     from jsonb_array_elements(public.get_profession_detail('test-prof', current_date) -> 'tiers') as t
    where (t ->> 'tier')::int = 0), 4,
  'the detail counts opened cards per module');
select is((select count(*)::int from public.profession_module_cards('test-prof/intro')), 4,
  'a module lists its live cards');
select is((select count(*)::int from public.profession_module_cards('test-prof/intro') where stage is not null), 4,
  'and marks the ones in the learner''s stack');

-- ---------------------------------------------------------------- isolation and placement
select pg_temp.act_as('dddddddd-dddd-4ddd-8ddd-dddddddddddd');

select is((select count(*)::int from public.profession_card_states), 0, 'D cannot see C''s stack');
select is((select count(*)::int from public.profession_enrollments), 0, 'or C''s enrolments');
select is((public.start_profession('test-prof', 1)).start_position, 1000000, 'D places into tier 1');
select is((public.open_next_profession_card('test-prof', current_date)) -> 'card' ->> 'id', 'test-prof/d1',
  'so D''s first card is tier 1''s first');
select is((public.start_profession('test-prof', 0)).start_position, 0, 'D moves the start back');
select is((public.open_next_profession_card('test-prof', current_date)) -> 'card' ->> 'id', 'test-prof/c1',
  'and the skipped cards come next, in order');
select throws_ok($$ select public.review_profession_card('test-prof/c3', true, current_date) $$, 'P0002', null,
  'D cannot review a card that is only in C''s stack');

select public.reset_profession('test-prof');
select is((select count(*)::int from public.profession_card_states), 0, 'resetting clears D''s stack');

-- ---------------------------------------------------------------- reports
select pg_temp.act_as('cccccccc-cccc-4ccc-8ccc-cccccccccccc');
insert into public.profession_card_reports (card_id, reason, note) values ('test-prof/c1', 'typo', 'Missing comma');
select pg_temp.act_as('dddddddd-dddd-4ddd-8ddd-dddddddddddd');
select is((select count(*)::int from public.profession_card_reports), 0, 'reports are private to their author');

-- ---------------------------------------------------------------- content safety and deletion
reset role;
select throws_ok($$ delete from public.profession_cards where id = 'test-prof/c1' $$, '23503', null,
  'a card in someone''s stack cannot be deleted (retire it instead)');

select pg_temp.act_as('cccccccc-cccc-4ccc-8ccc-cccccccccccc');
select public.delete_account();
reset role;
select is(
  (select count(*)::int from public.profession_card_states where user_id = 'cccccccc-cccc-4ccc-8ccc-cccccccccccc')
  + (select count(*)::int from public.profession_enrollments where user_id = 'cccccccc-cccc-4ccc-8ccc-cccccccccccc')
  + (select count(*)::int from public.profession_card_reports where user_id = 'cccccccc-cccc-4ccc-8ccc-cccccccccccc'),
  0, 'deleting an account removes its profession progress and reports');

select * from finish();
rollback;
