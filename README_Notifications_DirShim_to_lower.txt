AFW – Notifications Dir Shim → lowercase (Replace-Only)
=========================================================
Goal: Make import path "components/Notifications/NotificationsPanel" resolve on Linux.
Approach: Provide a DIRECTORY at that path with index.ts that re-exports the LOWERCASE component.
This avoids any self-reference loops.

Adds:
- src/components/Notifications/NotificationsPanel/index.ts  (→ export from '../../notifications/NotificationsPanel')

Steps:
1) Unzip into PROJECT ROOT (overwrite ok).
2) Local test: vercel build
3) Deploy: vercel --prod --force
