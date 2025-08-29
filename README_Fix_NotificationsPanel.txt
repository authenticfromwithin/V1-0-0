AFW – Fix Pack: NotificationsPanel
===================================
Place this zip at your project root and unzip with overwrite.

Adds the missing component:
- src/components/Notifications/NotificationsPanel.tsx

Usage:
- Journey.tsx / Healing.tsx import: components/Notifications/NotificationsPanel

QA:
node scripts/qa/expect-notifications.mjs
