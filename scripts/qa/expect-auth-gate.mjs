// AFW QA: expect-auth-gate.mjs
// Usage: node scripts/qa/expect-auth-gate.mjs
import fs from 'node:fs'
import path from 'node:path'
const root = process.cwd()
const out = { pass: [], fail: [] }
function ex(p){ return fs.existsSync(path.join(root,p)) }
function rd(p){ const f=path.join(root,p); return fs.existsSync(f)?fs.readFileSync(f,'utf8'):'' }
function asrt(c,m){ (c?out.pass:out.fail).push(m) }

asrt(ex('src/guards/RequireAuth.tsx'), 'RequireAuth present')
for (const p of ['src/pages/Healing.tsx','src/pages/Journey.tsx','src/pages/Quotes.tsx','src/pages/Devotionals.tsx']) {
  const s = rd(p)
  asrt(/RequireAuth/.test(s), `RequireAuth used in ${p}`)
}
const home = rd('src/pages/Home.tsx')
asrt(home && !/NavTabs/.test(home), 'Home has no header/nav tabs')
asrt(/SignInUpModal/.test(home), 'Home provides sign flow')
asrt(/SupportPanel/.test(home), 'Home provides support access')
console.log('==== AUTH GATE QA ====')
console.log(JSON.stringify(out,null,2))
if (out.fail.length) process.exitCode = 1
