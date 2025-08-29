AFW Admin App — Deploy Pack
=============================
Date: 2025-08-26

This creates an **/admin** app in your repo for a second Vercel deployment (Admin). It reads analytics from Supabase.
It requires the same Supabase project used by the public website.

Folder
------
admin/
  package.json, vite.config.ts, tsconfig.json, index.html, vercel.json, .nvmrc, .node-version
  src/
    lib/supabase.ts
    App.tsx, main.tsx
    pages/Login.tsx
    pages/Dashboard.tsx

Vercel (Admin Project)
----------------------
- Framework: Vite
- Root Directory: **admin/**
- Install Command: `npm install --no-audit --no-fund`
- Build Command: `npm run build`
- Output: `dist`
- Node: 22.x
- Env Vars:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`

Supabase SQL (run once, if not already present)
-----------------------------------------------
-- Analytics events table (if not created earlier)
create table if not exists public.events (
  t bigint primary key,
  type text not null,
  user_id uuid,
  data jsonb
);
alter table public.events enable row level security;

-- Admins table (who can read everything)
create table if not exists public.admins (
  user_id uuid primary key,
  email text unique not null
);
alter table public.admins enable row level security;

-- Only admins can read all events
create policy "admins can read events"
on public.events for select
to authenticated
using (exists (select 1 from public.admins a where a.user_id = auth.uid()));

-- Allow inserting events (website)
create policy "insert own or anon events"
on public.events for insert
to authenticated
with check (true);
create policy "insert anon events"
on public.events for insert
to anon
with check (true);

-- Admins can read their own record
create policy "admins self read"
on public.admins for select
to authenticated
using (auth.uid() = user_id);

Add yourself as admin
---------------------
-- Replace email with your account email used to sign up on the website
insert into public.admins (user_id, email)
select id as user_id, email from auth.users where email = 'you@example.com'
on conflict (user_id) do nothing;

Flow
----
1) Commit this folder to your repo.
2) Import **admin/** as a new Vercel project (monorepo).
3) Set env vars, deploy.
4) Visit the Admin URL → /login → sign in with the admin account (same Supabase auth).
5) You'll land on the Dashboard and see events streaming from the website.
