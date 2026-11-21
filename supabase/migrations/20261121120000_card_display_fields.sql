-- Two display-only fields on cards:
--   answer_display  a formatted version of a typed answer (LaTeX or code markup,
--                   see src/lib/rich.ts) shown on the back. `answer` stays the
--                   plain text students type and that gets checked.
--   search_query    what the card's "Learn more on Google" link searches for.
alter table public.pack_cards
  add column answer_display text check (answer_display is null or char_length(answer_display) <= 500),
  add column search_query text check (search_query is null or char_length(search_query) <= 200);

alter table public.memories
  add column answer_display text check (answer_display is null or char_length(answer_display) <= 500),
  add column search_query text check (search_query is null or char_length(search_query) <= 200);

-- add_pack copies them along with the rest of the card (unchanged otherwise;
-- create or replace keeps the existing grants).
create or replace function public.add_pack(p_pack_id text, p_today date, p_per_day int default 5)
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
    (user_id, title, body, answer, accepted_answers, answer_display, search_query, pack_id, pack_card_id, due_on, created_at)
  select (select auth.uid()), c.title, c.body, c.answer, c.accepted_answers, c.answer_display, c.search_query, c.pack_id, c.id,
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
