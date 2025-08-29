AFW – Normalize Notifications Imports (Replace-Only + Script)
==================================================================
Goal: Eliminate case-only folder duplication so imports are stable on Vercel (Linux).
We will rewrite any imports that reference:
  "components/Notifications/NotificationsPanel"
to the canonical lowercase path:
  "components/notifications/NotificationsPanel"

What this pack contains
- scripts/fix/fix-notifications-imports.mjs   (safe, idempotent replacer for Healing.tsx & Journey.tsx)
- scripts/qa/expect-notifications-imports.mjs (verifies imports are lowercase)
- README_Notifications_Normalize_Imports.txt  (this file)

How to apply
1) Unzip into PROJECT ROOT, overwrite ok.
2) Run the fixer:
   node scripts/fix/fix-notifications-imports.mjs
3) Verify:
   node scripts/qa/expect-notifications-imports.mjs
   → expect "fail": []

4) Deploy clean:
   vercel --prod --force

Notes
- You do NOT need to delete any folders. Once imports are lowercase, Vercel will not probe the uppercase path.
- Optional (local TS types): npm i -D @vercel/node
