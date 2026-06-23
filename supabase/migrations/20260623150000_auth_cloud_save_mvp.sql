create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  habid text unique not null,
  display_name text,
  locale text not null default 'en',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_habid_format check (
    habid = lower(habid)
    and char_length(habid) between 3 and 24
    and habid ~ '^[a-z0-9][a-z0-9_]*$'
  ),
  constraint profiles_habid_reserved check (
    habid not in ('admin', 'support', 'system', 'moderator', 'habidoo', 'official', 'staff')
  ),
  constraint profiles_locale_supported check (locale in ('en', 'ru', 'cs', 'uk'))
);

create table if not exists public.user_game_state (
  user_id uuid primary key references auth.users(id) on delete cascade,
  state jsonb not null,
  state_version integer not null check (state_version > 0),
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

revoke execute on function public.set_updated_at() from public;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists user_game_state_set_updated_at on public.user_game_state;
create trigger user_game_state_set_updated_at
before update on public.user_game_state
for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.user_game_state enable row level security;

revoke all on public.profiles from anon;
revoke all on public.user_game_state from anon;

grant select, insert on public.profiles to authenticated;
grant update (display_name, locale, updated_at) on public.profiles to authenticated;

grant select, insert on public.user_game_state to authenticated;
grant update (state, state_version, updated_at) on public.user_game_state to authenticated;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
on public.profiles
for select
to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own"
on public.profiles
for insert
to authenticated
with check ((select auth.uid()) = user_id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
on public.profiles
for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

drop policy if exists "user_game_state_select_own" on public.user_game_state;
create policy "user_game_state_select_own"
on public.user_game_state
for select
to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "user_game_state_insert_own" on public.user_game_state;
create policy "user_game_state_insert_own"
on public.user_game_state
for insert
to authenticated
with check ((select auth.uid()) = user_id);

drop policy if exists "user_game_state_update_own" on public.user_game_state;
create policy "user_game_state_update_own"
on public.user_game_state
for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);
