import fs from 'node:fs'; import path from 'node:path'
const root = process.cwd()
function read(p){ const f=path.join(root,p); return fs.existsSync(f)?fs.readFileSync(f,'utf8'):'' }
const app = read('src/App.tsx')
const hasPages = /from 'pages\/Home'/.test(app)
const hasRoutes = /from "routes\//.test(app) || /from 'routes\//.test(app)

const out = { pass: [], fail: [] }
if (hasPages) out.pass.push('App.tsx uses pages/* imports')
else out.fail.push('App.tsx still not updated to pages/*')

if (!hasRoutes) out.pass.push('No legacy routes/* imports in App.tsx')
else out.fail.push('Legacy routes/* imports still present in App.tsx')

const notif = fs.existsSync(path.join(root,'src/components/Notifications/NotificationsPanel.tsx'))
if (notif) out.pass.push('NotificationsPanel present')
else out.fail.push('NotificationsPanel missing')

console.log('==== DEV FIX QA ====')
console.log(JSON.stringify(out,null,2))
if (out.fail.length) process.exitCode = 1
