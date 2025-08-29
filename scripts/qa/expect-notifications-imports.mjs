import fs from 'node:fs'
import path from 'node:path'

const targets = ['src/pages/Healing.tsx', 'src/pages/Journey.tsx']
const bad = 'components/Notifications/NotificationsPanel'
const res = { pass: [], fail: [] }
for (const rel of targets) {
  const p = path.resolve(process.cwd(), rel)
  if (!fs.existsSync(p)) { res.fail.push(rel + ' (missing)'); continue }
  const txt = fs.readFileSync(p, 'utf8')
  if (txt.includes(bad)) res.fail.push(rel + ' (has uppercase path)')
  else res.pass.push(rel)
}
console.log('==== Notifications Imports QA ====\n' + JSON.stringify(res, null, 2))
if (res.fail.length) process.exitCode = 1
