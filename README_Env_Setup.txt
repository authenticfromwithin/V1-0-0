AFW – Environment Setup Pack
================================

This pack helps you configure the two required environment variables for both the Website (root app) and the Admin app.

YOU NEED FROM SUPABASE
----------------------
1) Project URL (looks like: https://abcd1234.supabase.co)
2) anon public key (long string starting with eyJ…)
   Supabase Dashboard → Settings → API → Project URL + anon public

HOW TO RUN (Windows PowerShell)
-------------------------------
1) Open PowerShell at your project root (AFW-Offline-Build-Node22-Vite)
2) Allow script for this session only:
   Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
3) Run the setup:
   .\scripts\setup\set-env.ps1

   • You’ll be prompted for:
     - VITE_SUPABASE_URL
     - VITE_SUPABASE_ANON_KEY
   • The script writes:
     - .env.local (in project root)
     - admin\.env.local (in admin app)

4) Verify:
   node scripts\setup\verify-env.mjs

5) Start dev:
   npm run dev
   (admin in a 2nd terminal)
   cd admin; npm run dev -- --port 5174

VERCEL (Production)
-------------------
In each Vercel project (Website and Admin):
Settings → Environment Variables → add:
- VITE_SUPABASE_URL
- VITE_SUPABASE_ANON_KEY
Set both for *Production* and *Preview*. Then redeploy (Clear Build Cache once).

SQL PATCHES (Supabase → SQL Editor)
-----------------------------------
A) Name & Surname fields for profiles (run once):
   scripts/sql/profiles_patch.sql

B) Admin allow-list (replace your email, run once):
   scripts/sql/admin_allow.sql

Manual option
-------------
Create/edit these files with the two lines shown:
• .env.local
• admin/.env.local

Each must contain EXACTLY:
VITE_SUPABASE_URL=https://abcd1234.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
