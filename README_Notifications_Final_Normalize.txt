AFW – Notifications Final Normalize (Replace-Only)
===================================================
This pack:
- Provides real component files at BOTH casings:
  - src/components/Notifications/NotificationsPanel.tsx
  - src/components/notifications/NotificationsPanel.tsx
  (No re-exports → no rollup self-reference cycles)

- Adds .vercelignore to force-include src/**, api/**, and both Notifications paths.

What to do:
1) Unzip into PROJECT ROOT and overwrite.
2) QA (optional): node scripts/qa/expect-notifications-final.mjs
3) Clean deploy: vercel --prod --force

If a build still fails, paste the new error path and I will ship the next micro-patch.
