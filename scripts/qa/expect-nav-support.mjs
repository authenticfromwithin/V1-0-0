// AFW QA: expect-nav-support.mjs
// Usage: node scripts/qa/expect-nav-support.mjs
import fs from 'node:fs'
import path from 'node:path'
const root = process.cwd()
const out = { pass: [], fail: [], info: [] }
const must = [
  'src/components/ui/NavTabs.tsx',
  'src/components/ui/ProfileMenu.tsx',
  'src/components/Notifications/NotificationsPanel.tsx',
  'src/components/Feedback/FeedbackPanel.tsx',
  'src/components/Support/SupportPanel.tsx',
  'src/components/Auth/SignInUp.tsx',
  'src/components/Profile/ProfilePanel.tsx',
  'src/components/Settings/SettingsPanel.tsx',
  'src/pages/Home.tsx',
  'src/pages/Healing.tsx',
  'src/pages/Journey.tsx',
]
function ex(p){ return fs.existsSync(path.join(root,p)) }
function rd(p){ const f = path.join(root,p); return fs.existsSync(f) ? fs.readFileSync(f,'utf8') : '' }
function asrt(c,m){ (c?out.pass:out.fail).push(m) }
for (const f of must) asrt(ex(f), `Exists: ${f}`)
for (const p of ['src/pages/Home.tsx','src/pages/Healing.tsx','src/pages/Journey.tsx']) {
  const s = rd(p); asrt(/from ['"]components\/ui\/NavTabs['"]/.test(s), `Import NavTabs in ${p}`); asrt(/<NavTabs\s*\/>/.test(s), `Render <NavTabs /> in ${p}`)
}
const menu = rd('src/components/ui/ProfileMenu.tsx')
asrt(!/href=["']\/healing["']/.test(menu), 'Dropdown has no /healing link')
asrt(!/href=["']\/journey["']/.test(menu), 'Dropdown has no /journey link')
asrt(!/href=["']\/devotionals["']/.test(menu), 'Dropdown has no /devotionals link')
asrt(!/href=["']\/quotes["']/.test(menu), 'Dropdown has no /quotes link')
asrt(/Notifications/.test(menu), 'Dropdown contains Notifications')
asrt(/Feedback/.test(menu), 'Dropdown contains Feedback')
asrt(/Technical Support/.test(menu), 'Dropdown contains Technical Support')
asrt(/Profile/.test(menu), 'Dropdown contains Profile')
asrt(/Settings/.test(menu), 'Dropdown contains Settings')
asrt(/Sign out/.test(menu), 'Dropdown contains Sign out')
console.log('==== NAV/SUPPORT QA ====');
console.log(JSON.stringify(out,null,2))
if (out.fail.length) { process.exitCode = 1 }
