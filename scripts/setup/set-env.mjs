import fs from 'node:fs'
import readline from 'node:readline'

const rl = readline.createInterface({ input: process.stdin, output: process.stdout })

function ask(q){ return new Promise(res => rl.question(q, a => res(a.trim()))) }

async function main(){
  console.log('AFW Env Setup (Node.js alternative)')
  const url = (await ask('Enter VITE_SUPABASE_URL (example: https://abcd1234.supabase.co): ')).trim()
  const anon = (await ask('Enter VITE_SUPABASE_ANON_KEY (starts with eyJ...): ')).trim()
  rl.close()

  const lines = `VITE_SUPABASE_URL=${url}\nVITE_SUPABASE_ANON_KEY=${anon}\n`
  fs.writeFileSync('.env.local', lines, 'utf8')
  console.log('Wrote .env.local')
  try {
    fs.mkdirSync('admin', { recursive: true })
    fs.writeFileSync('admin/.env.local', lines, 'utf8')
    console.log('Wrote admin/.env.local')
  } catch {}
  console.log('Done. Verify with: node scripts/setup/verify-env.mjs')
}

main().catch(e => { console.error(e); process.exit(1) })
