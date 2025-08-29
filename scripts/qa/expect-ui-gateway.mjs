import fs from 'node:fs'
const must = ['src/guards/RequireAuth.tsx']
const res = { pass: [], fail: [] }
for (const p of must) fs.existsSync(p) ? res.pass.push(p) : res.fail.push(p)
console.log('==== UI GATEWAY QA ====')
console.log(JSON.stringify(res, null, 2))
if (res.fail.length) process.exitCode = 1
