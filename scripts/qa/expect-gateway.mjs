import fs from 'node:fs'

const must = [
  'vite.config.ts',
  'api/_lib/supabase.ts',
  'api/auth/signup.ts',
  'api/auth/signin.ts',
  'api/auth/signout.ts',
  'api/profile/index.ts',
  'api/profile/post.ts',
  'api/admin/notifications/index.ts',
  'api/admin/notifications/create.ts'
]

const result = { pass: [], fail: [] }
for (const f of must) {
  if (fs.existsSync(f)) result.pass.push(f)
  else result.fail.push(f)
}

console.log('==== API+Vite QA ====')
console.log(JSON.stringify(result, null, 2))
if (result.fail.length) process.exitCode = 1
