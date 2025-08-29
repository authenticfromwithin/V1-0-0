import fs from 'node:fs'
import path from 'node:path'

const roots = ['src/pages/Healing.tsx', 'src/pages/Journey.tsx']
const from = /components\/Notifications\/NotificationsPanel/g
const to = 'components/notifications/NotificationsPanel'

const results = []
for (const rel of roots) {
  const p = path.resolve(process.cwd(), rel)
  if (!fs.existsSync(p)) { results.push({ file: rel, status: 'skip (missing)' }); continue }
  const before = fs.readFileSync(p, 'utf8')
  const after = before.replace(from, to)
  if (after !== before) {
    fs.writeFileSync(p, after, 'utf8')
    results.push({ file: rel, status: 'patched' })
  } else {
    results.push({ file: rel, status: 'ok (no change)' })
  }
}
console.log('==== Notifications Import Fix ====\n' + JSON.stringify(results, null, 2))
