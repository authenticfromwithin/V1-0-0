// AFW QA: expect-admin.mjs
// Usage: node scripts/qa/expect-admin.mjs
import fs from 'node:fs'
import path from 'node:path'
const root = process.cwd()
const out = { pass: [], fail: [] }
const must = [
  'admin/package.json',
  'admin/tsconfig.json',
  'admin/vite.config.ts',
  'admin/index.html',
  'admin/src/main.tsx',
  'admin/src/App.tsx',
  'admin/src/styles.css',
  'admin/src/logic/supabaseClient.ts',
  'admin/src/pages/Events.tsx',
  'admin/src/pages/Progress.tsx',
  'admin/src/pages/Profiles.tsx',
  'admin/src/pages/Notifications.tsx',
  'admin/src/pages/Feedback.tsx',
  'admin/vercel.json'
]
function ex(p){ return fs.existsSync(path.join(root,p)) }
function asrt(c,m){ (c?out.pass:out.fail).push(m) }
for (const f of must) asrt(ex(f), `Exists: ${f}`)
console.log('==== ADMIN QA ====')
console.log(JSON.stringify(out,null,2))
if (out.fail.length) process.exitCode = 1
