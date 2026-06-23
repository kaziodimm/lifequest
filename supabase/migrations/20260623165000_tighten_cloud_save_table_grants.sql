revoke all on public.profiles from anon, authenticated;
revoke all on public.user_game_state from anon, authenticated;

grant select, insert on public.profiles to authenticated;
grant update (display_name, locale, updated_at) on public.profiles to authenticated;

grant select, insert on public.user_game_state to authenticated;
grant update (state, state_version, updated_at) on public.user_game_state to authenticated;
