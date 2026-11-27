-- Account reset: run with `npm run db:test` (supabase test db).
-- Checks that reset_account erases only the caller's cards, reviews and
-- profession progress, keeps the account and its problem reports, leaves
-- other users alone, refuses signed-out callers, and allows a fresh start.
-- Builds its own fixture and rolls everything back.

begin;
create extension if not exists pgtap with schema extensions;

select plan(16);

insert into auth.users (id, email, aud, role, instance_id)
values
  ('eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee', 'e@test.dev', 'authenticated', 'authenticated', '00000000-0000-0000-0000-000000000000'),
  ('ffffffff-ffff-4fff-8fff-ffffffffffff', 'f@test.dev', 'authenticated', 'authenticated', '00000000-0000-0000-0000-000000000000');

create function pg_temp.act_as(uid uuid) returns void language sql as $$
  select set_config('request.jwt.claims', json_build_object('sub', uid, 'role', 'authenticated')::text, true);
  set local role authenticated;
$$;

-- A one-module profession with two cards.
insert into public.professions (id, name, tagline, description, icon, accent, gradient, planned_cards, position)
values ('reset-prof', 'Reset Profession', 'For tests', 'A fixture.', 'school', '#6C4DFF', array['#6C4DFF', '#B44DFF'], 2, 98);
insert into public.profession_tiers (profession_id, tier, slug, name, milestone, summary, planned_cards)
values ('reset-prof', 0, 'basics', 'Basics', null, 'You know the basics.', 2);
insert into public.profession_modules (id, profession_id, tier, position, title, summary, planned_cards)
values ('reset-prof/intro', 'reset-prof', 0, 0, 'Intro', 'Start here.', 2);
insert into public.profession_cards (id, profession_id, module_id, position, kind, difficulty, checkpoint, title, body, retired)
values
  ('reset-prof/c1', 'reset-prof', 'reset-prof/intro', 0, 'definition', 1, false, 'Reset card 1?', 'One', false),
  ('reset-prof/c2', 'reset-prof', 'reset-prof/intro', 1, 'definition', 1, false, 'Reset card 2?', 'Two', false);

-- Both users have cards, reviews of both kinds and profession progress; E has also sent a report.
insert into public.memories (id, user_id, title, due_on)
values
  ('a1111111-1111-4111-8111-111111111111', 'eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee', 'E card one', current_date),
  ('a2222222-2222-4222-8222-222222222222', 'eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee', 'E card two', current_date),
  ('b1111111-1111-4111-8111-111111111111', 'ffffffff-ffff-4fff-8fff-ffffffffffff', 'F card one', current_date);
insert into public.reviews (user_id, memory_id, profession_card_id, reviewed_on, passed)
values
  ('eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee', 'a1111111-1111-4111-8111-111111111111', null, current_date, true),
  ('eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee', null, 'reset-prof/c1', current_date, false),
  ('ffffffff-ffff-4fff-8fff-ffffffffffff', 'b1111111-1111-4111-8111-111111111111', null, current_date, true);
insert into public.profession_enrollments (user_id, profession_id, start_position)
values ('eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee', 'reset-prof', 1),
       ('ffffffff-ffff-4fff-8fff-ffffffffffff', 'reset-prof', 0);
insert into public.profession_card_states (user_id, card_id, profession_id, due_on, opened_on)
values ('eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee', 'reset-prof/c2', 'reset-prof', current_date, current_date),
       ('ffffffff-ffff-4fff-8fff-ffffffffffff', 'reset-prof/c1', 'reset-prof', current_date, current_date);
insert into public.profession_card_reports (user_id, card_id, reason)
values ('eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee', 'reset-prof/c1', 'typo');

-- ---------------------------------------------------------------- who may reset
set local role anon;
select throws_ok($$ select public.reset_account() $$, '42501', null, 'signed-out visitors cannot reset an account');
reset role;

select pg_temp.act_as('eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee');
select lives_ok($$ select public.reset_account() $$, 'a signed-in user can reset their account');
reset role;

-- ---------------------------------------------------------------- what is erased
select is((select count(*)::int from public.memories where user_id = 'eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee'), 0,
  'all of the user''s cards are erased');
select is((select count(*)::int from public.reviews where user_id = 'eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee'), 0,
  'all of the user''s reviews are erased, memory and profession reviews alike');
select is((select count(*)::int from public.profession_card_states where user_id = 'eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee'), 0,
  'all of the user''s opened profession cards are erased');
select is((select count(*)::int from public.profession_enrollments where user_id = 'eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee'), 0,
  'all of the user''s profession enrolments and placements are erased');

-- ---------------------------------------------------------------- what is kept
select is((select count(*)::int from auth.users where id = 'eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee'), 1,
  'the account itself is kept');
select is((select count(*)::int from public.profession_card_reports where user_id = 'eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee'), 1,
  'problem reports the user sent are kept');
select is((select count(*)::int from public.profession_cards where profession_id = 'reset-prof'), 2,
  'shared profession content is untouched');

-- ---------------------------------------------------------------- other users
select is((select count(*)::int from public.memories where user_id = 'ffffffff-ffff-4fff-8fff-ffffffffffff'), 1,
  'another user''s cards are untouched');
select is((select count(*)::int from public.reviews where user_id = 'ffffffff-ffff-4fff-8fff-ffffffffffff'), 1,
  'another user''s reviews are untouched');
select is((select count(*)::int from public.profession_card_states where user_id = 'ffffffff-ffff-4fff-8fff-ffffffffffff'), 1,
  'another user''s profession cards are untouched');
select is((select count(*)::int from public.profession_enrollments where user_id = 'ffffffff-ffff-4fff-8fff-ffffffffffff'), 1,
  'another user''s enrolment is untouched');

-- ---------------------------------------------------------------- a fresh start
select pg_temp.act_as('eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee');
select is((public.start_profession('reset-prof', 0)).start_position, 0, 'after a reset the user can start a profession again');
select is(public.open_next_profession_card('reset-prof', current_date) -> 'card' ->> 'id', 'reset-prof/c1',
  'and opening starts again from the first card');
select lives_ok($$ select public.reset_account() $$, 'resetting again is harmless');
reset role;

select * from finish();
rollback;
