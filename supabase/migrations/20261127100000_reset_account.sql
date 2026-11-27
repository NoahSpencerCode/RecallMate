-- Account reset: lets a signed-in user erase every card and all learning
-- history and start fresh, while keeping the account itself (email and
-- sign-in). Unlike delete_account, the auth user stays.
--
-- Erased: memories (including every study pack card the user added), the
-- review log (so streaks, the heatmap and accuracy start from zero), and all
-- profession progress (enrolments, placement and card states).
-- Kept: problem reports about profession cards. They are feedback on shared
-- content, not part of the learner's own progress.
--
-- Runs with elevated rights, so every statement filters on the caller.
create function public.reset_account()
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  me uuid := (select auth.uid());
begin
  if me is null then
    raise exception 'You need to be signed in' using errcode = '42501';
  end if;
  -- Reviews first and explicitly: deleting a memory only clears the link in
  -- its reviews (on delete set null), and profession reviews have no memory.
  delete from public.reviews where user_id = me;
  delete from public.profession_card_states where user_id = me;
  delete from public.profession_enrollments where user_id = me;
  delete from public.memories where user_id = me;
end;
$$;

revoke all on function public.reset_account() from public, anon;
grant execute on function public.reset_account() to authenticated;
