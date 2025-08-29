AFW — Consolidated Launch Pack (Replace-only)
Date: 2025-08-27

What this pack adds
- Accounts (Supabase) + Profile creation
- Per-user progress storage
- Top navigation tabs for pages (Healing, My Journey, Devotionals, Quotes)
- Dropdown with support actions (Notifications, Feedback, Technical Support, Profile, Settings, Sign out)
- Support/Feedback/Notifications panels
- Analytics stub (local-only) + export NDJSON (no journals)

How to apply (root of repo)
1) Unzip this pack into your project root. Allow overwrite on matching files.
2) Install Supabase client in both projects:
   npm i @supabase/supabase-js
   cd admin && npm i @supabase/supabase-js && cd ..
3) Supabase → SQL Editor: run docs/SQL_Full_Integration.txt, then docs/SQL_Nav_Support.txt
   - Edit the admins seed email to yours and run once.
4) Vercel: set env (both Website and Admin)
   VITE_SUPABASE_URL
   VITE_SUPABASE_ANON_KEY
5) Local QA:
   node scripts/qa/expect-nav-support.mjs
   node scripts/qa/predeploy.mjs
6) Build:
   npm run build
   (cd admin && npm run build)

Notes
- Journals remain local-only (IndexedDB). None of these changes upload journal content.
- If @supabase/supabase-js is missing, auth panels will error until installed & env is set.
