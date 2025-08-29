import fs from 'node:fs'
const paths = [
  'src/components/Notifications/NotificationsPanel.tsx',
  'src/components/notifications/NotificationsPanel.tsx'
]
const res = { pass: [], fail: [] }
for (const p of paths) (fs.existsSync(p) ? res.pass : res.fail).push(p)
console.log('==== Notifications Final QA ====')
console.log(JSON.stringify(res, null, 2))
if (res.fail.length) process.exitCode = 1
