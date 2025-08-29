-- AFW: Admin allow-list (run once)
-- Simple table to list admin emails.
create table if not exists public.admins (
  email text primary key
);

-- REPLACE this with your real email:
insert into public.admins(email) values ('you@example.com')
on conflict (email) do nothing;
