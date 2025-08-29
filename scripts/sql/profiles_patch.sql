-- AFW: Add Name & Surname to public profiles (run once)
-- Adjust table name if yours differs.
create table if not exists public.profiles_public (
  id uuid primary key default gen_random_uuid()
);

alter table public.profiles_public
  add column if not exists first_name text,
  add column if not exists last_name text;
