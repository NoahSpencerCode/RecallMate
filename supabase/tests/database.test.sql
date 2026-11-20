-- Database tests: run with `npm run db:test` (supabase test db).
-- Covers Row Level Security, the Fibonacci scheduler, pack adding, progress
-- stats and account deletion. Everything runs in a transaction and rolls back.

begin;
create extension if not exists pgtap with schema extensions;

select plan(28);

-- Two students, A and B.
insert into auth.users (id, email, aud, role, instance_id)
values
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'a@test.dev', 'authenticated', 'authenticated', '00000000-0000-0000-0000-000000000000'),
  ('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', 'b@test.dev', 'authenticated', 'authenticated', '00000000-0000-0000-0000-000000000000');

create function pg_temp.act_as(uid uuid) returns void language sql as $$
  select set_config('request.jwt.claims', json_build_object('sub', uid, 'role', 'authenticated')::text, true);
  set local role authenticated;
$$;

-- ---------------------------------------------------------------- scheduler
select is(public.fib(1), 1::bigint, 'fib(1) = 1');
select is(array[public.fib(2), public.fib(3), public.fib(4), public.fib(5), public.fib(6)], array[1, 2, 3, 5, 8]::bigint[],
  'fib continues 1, 2, 3, 5, 8');

-- ---------------------------------------------------------------- packs
select pg_temp.act_as('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa');

select is(
  public.add_pack('calc-derivatives', current_date, 5),
  (select count(*)::int from public.pack_cards where pack_id = 'calc-derivatives'),
  'add_pack copies every card in the pack');
select is((select count(*)::int from public.memories where due_on = current_date), 5,
  'with 5 a day, five cards are due today');
select is((select count(*)::int from public.memories where due_on = current_date + 1), 5,
  'and five more tomorrow');
select is(public.add_pack('calc-derivatives', current_date, 5), 0, 'adding the same pack again adds nothing');
select is(
  (select array_agg(c.position order by m.created_at) from public.memories m join public.pack_cards c on c.id = m.pack_card_id),
  (select array_agg(position order by position) from public.pack_cards where pack_id = 'calc-derivatives'),
  'cards keep the pack''s teaching order');
select throws_ok($$ select public.add_pack('no-such-pack', current_date, 5) $$, 'P0002', null, 'unknown packs are rejected');

-- ---------------------------------------------------------------- reviews
create temp table picks as
  select id, row_number() over (order by created_at) as n
    from public.memories where due_on = current_date;
grant select on picks to authenticated;

select is((public.review_memory((select id from picks where n = 1), true, current_date)).stage, 1,
  'a pass moves the card up one stage');
select is((select due_on from public.memories where id = (select id from picks where n = 1)), current_date + 1,
  'first pass: next review tomorrow (fib 1)');
select throws_ok(
  format('select public.review_memory(%L, true, current_date)', (select id from picks where n = 1)),
  '22023', null, 'a card that is not due yet cannot be reviewed');

update public.memories set due_on = current_date, stage = 3 where id = (select id from picks where n = 2);
select is((public.review_memory((select id from picks where n = 2), true, current_date)).due_on, current_date + 5,
  'passing a stage-3 card schedules it 5 days out');
select is((public.review_memory((select id from picks where n = 3), false, current_date, 3)).stage, 0,
  'a miss resets the stage');
select is((select lapse_count from public.memories where id = (select id from picks where n = 3)), 1,
  'and counts a lapse');
select throws_ok(
  format('select public.review_memory(%L, true, %L::date)', (select id from picks where n = 4), current_date - 5),
  '22023', null, 'a date that cannot be the caller''s today is rejected');

select is((public.get_progress(current_date) ->> 'reviewed_today')::int, 3, 'progress counts today''s reviews');
select is((public.get_progress(current_date) ->> 'current_streak')::int, 1, 'reviewing today starts a streak');
select is(jsonb_array_length(public.get_progress(current_date) -> 'forecast'), 7, 'forecast covers 7 days');

-- ---------------------------------------------------------------- isolation
select pg_temp.act_as('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb');

select is((select count(*)::int from public.memories), 0, 'B cannot see A''s memories');
select is((select count(*)::int from public.reviews), 0, 'B cannot see A''s reviews');
update public.memories set title = 'hacked';
delete from public.memories;
select throws_ok(
  $$ insert into public.memories (user_id, title, due_on) values ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'spoof', current_date) $$,
  '42501', null, 'B cannot create memories for A');
select is((public.get_progress(current_date) -> 'memories' ->> 'total')::int, 0, 'B''s progress only counts B''s cards');

reset role;
select is((select count(*)::int from public.memories where user_id = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa' and title = 'hacked'), 0,
  'B''s update did not touch A''s cards');
select ok((select count(*) from public.memories where user_id = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa') > 0,
  'B''s delete did not touch A''s cards');

-- ---------------------------------------------------------------- anonymous
set local role anon;
select ok((select count(*) from public.packs) > 0 and (select count(*) from public.pack_cards) > 0,
  'anyone can browse packs and their cards');
select is((select count(*)::int from public.memories), 0, 'signed-out visitors see no memories');
select throws_ok($$ select public.add_pack('calc-derivatives', current_date, 5) $$, '42501', null,
  'signed-out visitors cannot call the RPCs');

-- ---------------------------------------------------------------- deletion
select pg_temp.act_as('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa');
select public.delete_account();
reset role;
select is((select count(*)::int from public.memories where user_id = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'), 0,
  'deleting an account removes its memories');

select * from finish();
rollback;
