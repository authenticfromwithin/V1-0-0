AFW — Nav Tabs + Support/Feedback/Notifications (Replace-only Pack)

What this does
--------------
- Adds top **Navigation Tabs** (Healing, My Journey, Devotionals, Quotes).
- Moves **ALL pages into the nav**, **NOT** in the dropdown.
- Dropdown now contains **Notifications, Feedback, Technical Support, Profile, Settings, Sign out**.
- Adds panels for **Notifications**, **Feedback**, **Support**.
- Updates Home/Healing/Journey headers to include **NavTabs** + panels.
- Extends Admin dashboard with **Notifications** and **Feedback** tabs.

Files (drop at these exact paths)
---------------------------------
Website:
- src/components/ui/NavTabs.tsx
- src/components/ui/ProfileMenu.tsx          ← OVERWRITE
- src/components/Notifications/NotificationsPanel.tsx
- src/components/Feedback/FeedbackPanel.tsx
- src/components/Support/SupportPanel.tsx
- src/pages/Home.tsx                          ← OVERWRITE
- src/pages/Healing.tsx                       ← OVERWRITE
- src/pages/Journey.tsx                       ← OVERWRITE

Admin:
- admin/src/pages/Dashboard.tsx               ← OVERWRITE (adds tabs)

Database (Supabase → SQL Editor)
--------------------------------
Run `docs/SQL_Nav_Support.txt` once to create tables and policies for **notifications** and **feedback**.

Notes
-----
- Journals remain local-only.
- If Supabase env is missing, panels still open; they just won’t load/send data.
- Styling matches sacred/cinematic tone; no cartoony elements.
