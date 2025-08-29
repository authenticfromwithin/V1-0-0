AFW – Notifications DirIndex Fix (Replace-Only)
===================================================
Purpose: Vercel build looks for path "components/Notifications/NotificationsPanel"
exactly. On Linux, if the direct file is missed, making it a DIRECTORY with index.tsx
guarantees resolution.

This pack adds both directory-index shims:
- src/components/Notifications/NotificationsPanel/index.tsx
- src/components/notifications/NotificationsPanel/index.tsx

Each re-exports the canonical component so both casings work.

Steps
1) Unzip into PROJECT ROOT. Overwrite if asked.
2) Run: node scripts/qa/expect-notifications-casing.mjs  (should still pass)
3) Deploy: vercel --prod --force
