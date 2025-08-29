AFW — E2EE Sign-up Delta Pack
=================================
Date: 2025-08-26

What this adds
--------------
- **Client-side encryption** for sign-up profile metadata using WebCrypto (AES-GCM + PBKDF2).
- **Passphrase required on Sign-up** (min 8 chars). We encrypt a tiny profile JSON and store it server-side.
- On **Sign-in**, user can optionally enter passphrase to unlock the profile. (Auth works even if they skip.)

Files (drop into repo at these exact paths)
-------------------------------------------
- src/logic/crypto/e2ee.ts
- src/logic/auth/secureProfile.ts
- src/logic/auth/SignInUp.tsx      ← OVERWRITES the modal to include passphrase logic and secure storage

Backend (Supabase) — one-time SQL
---------------------------------
```sql
create table if not exists public.profiles_secure (
  user_id uuid primary key references auth.users(id) on delete cascade,
  version int not null default 1,
  salt text not null,
  iv text not null,
  ciphertext text not null,
  updated_at timestamptz not null default now()
);
alter table public.profiles_secure enable row level security;

create policy "owner insert" on public.profiles_secure for insert to authenticated
with check (auth.uid() = user_id);
create policy "owner update" on public.profiles_secure for update to authenticated
using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "owner select" on public.profiles_secure for select to authenticated
using (auth.uid() = user_id);
```

Environment
-----------
- Website Vercel env: `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` must be set.
- No new env vars are required for E2EE. The passphrase never leaves the browser.

Notes
-----
- This **does not** touch journals (still local/IndexedDB; optional encryption remains).
- Email/password still go to Supabase Auth over HTTPS; E2EE protects *additional* profile metadata.
- Admin app **cannot decrypt** `profiles_secure` content (by design). Admins only see analytics in `public.events`.

Deploy steps
------------
1) Drop these files into your repo (replace-only where noted).
2) Run the SQL in Supabase.
3) Commit & push, then redeploy the website (Clear build cache).
4) Sign up with a passphrase, sign out, sign in again; (optional) enter passphrase to unlock.
