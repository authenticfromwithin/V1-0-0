import fs from 'node:fs'

function readEnv(p){
  if(!fs.existsSync(p)) return null
  const s = fs.readFileSync(p,'utf8')
  const out = {}
  for (const line of s.split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.+)\s*$/)
    if (m) out[m[1]] = m[2]
  }
  return out
}

const rootEnv = readEnv('.env.local')
const adminEnv = readEnv('admin/.env.local')

const result = { pass:[], fail:[], warn:[] }

if (rootEnv && rootEnv.VITE_SUPABASE_URL && rootEnv.VITE_SUPABASE_ANON_KEY) {
  result.pass.push('Root .env.local has both variables')
} else {
  result.fail.push('Root .env.local missing variables')
}

if (adminEnv && adminEnv.VITE_SUPABASE_URL && adminEnv.VITE_SUPABASE_ANON_KEY) {
  result.pass.push('Admin .env.local has both variables')
} else {
  result.warn.push('Admin .env.local missing variables (ok if admin app not used yet)')
}

console.log('==== ENV VERIFY ====')
console.log(JSON.stringify(result,null,2))
if (result.fail.length) process.exitCode = 1
