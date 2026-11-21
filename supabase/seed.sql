-- Local development seed (runs on `npm run db:reset`; never deployed).
--
-- Demo account:  demo@recallmate.test  /  recallmate-demo
-- Use the same password for any throwaway accounts you sign up with locally.
-- Local auth emails (confirmations, password resets) land in Mailpit:
-- http://127.0.0.1:54324
--
-- The demo user has three packs at different stages plus ~6 weeks of review
-- history, so Today, Library and Progress all have something to show.

do $$
declare
  demo constant uuid := '0d1f7a3c-5b2e-4c11-9a6d-7e3b2c1d4e5f';
  card record;
  i int;
  d int;
begin
  insert into auth.users (
    instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
    confirmation_token, email_change, email_change_token_new, recovery_token
  ) values (
    '00000000-0000-0000-0000-000000000000', demo, 'authenticated', 'authenticated',
    'demo@recallmate.test', extensions.crypt('recallmate-demo', extensions.gen_salt('bf')), now(),
    '{"provider":"email","providers":["email"]}', '{}', now() - interval '45 days', now(),
    '', '', '', ''
  );

  insert into auth.identities (id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
  values (
    gen_random_uuid(), demo, demo::text,
    jsonb_build_object('sub', demo::text, 'email', 'demo@recallmate.test', 'email_verified', true),
    'email', now(), now(), now()
  );

  -- Calculus I: well underway (some due, some soon, some mastered).
  i := 0;
  for card in select * from public.pack_cards where pack_id = 'calc-derivatives' order by position limit 16 loop
    i := i + 1;
    insert into public.memories (
      user_id, title, body, answer, accepted_answers, answer_display, search_query, pack_id, pack_card_id,
      stage, due_on, review_count, lapse_count, last_reviewed_on, created_at
    ) values (
      demo, card.title, card.body, card.answer, card.accepted_answers, card.answer_display, card.search_query,
      card.pack_id, card.id,
      case when i <= 6 then 1 + i % 2 when i <= 11 then 3 else 5 + i % 2 end,
      case when i <= 6 then current_date - (i % 3) when i <= 11 then current_date + (i - 6) else current_date + 6 + i end,
      case when i <= 6 then 2 when i <= 11 then 4 else 6 end,
      case when i % 4 = 0 then 1 else 0 end,
      current_date - 1,
      now() - interval '40 days'
    );
  end loop;

  -- Biology: added today at 5 new cards a day.
  i := 0;
  for card in select * from public.pack_cards where pack_id = 'bio-cell-structure' order by position loop
    insert into public.memories (
      user_id, title, body, answer, accepted_answers, answer_display, search_query, pack_id, pack_card_id, due_on
    ) values (
      demo, card.title, card.body, card.answer, card.accepted_answers, card.answer_display, card.search_query,
      card.pack_id, card.id, current_date + i / 5
    );
    i := i + 1;
  end loop;

  -- A couple of the user's own cards.
  insert into public.memories (user_id, title, body, answer, accepted_answers, stage, due_on, review_count, last_reviewed_on)
  values
    (demo, 'Office hours for CHEM 201?', 'Tuesdays 2–4 pm, Science Hall 310. Bring the problem set.', null, '{}', 2, current_date, 3, current_date - 2),
    (demo, 'Big-O of looking up a key in a hash map (average case)?', 'O(1) on average; O(n) worst case when everything collides.',
     'O(1)', array['constant', 'constant time'], 1, current_date + 1, 1, current_date - 1);

  -- Review history: a 6-day streak ending yesterday, plus older scattered days.
  for d in 1..6 loop
    insert into public.reviews (user_id, reviewed_on, reviewed_at, passed, attempts)
    select demo, current_date - d, now() - make_interval(days => d), (g % 5) <> 0, 1
      from generate_series(1, 3 + d) as g;
  end loop;
  for d in 9..44 by 3 loop
    insert into public.reviews (user_id, reviewed_on, reviewed_at, passed, attempts)
    select demo, current_date - d, now() - make_interval(days => d), (g % 4) <> 0, 1
      from generate_series(1, 2 + d % 7) as g;
  end loop;
end
$$;
