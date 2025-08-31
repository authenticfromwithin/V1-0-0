// Usage: node scripts/qa.js https://your-domain.vercel.app
import { request } from 'https'

function head(url){
  return new Promise((resolve) => {
    const req = request(url, { method:'HEAD' }, res => {
      resolve({ url, status: res.statusCode, type: res.headers['content-type'] || '' })
    })
    req.on('error', () => resolve({ url, status: 0, type: '' }))
    req.end()
  })
}

const base = process.argv[2] || 'http://localhost:5173'
const assets = [
  '/assets/scenes/forest/plates/back.webp',
  '/assets/scenes/forest/plates/mid.webp',
  '/assets/scenes/forest/plates/front.webp',
  '/assets/scenes/forest/fire/fire.webm',
]

const js = (await (await fetch(base + '/index.html')).text()).match(/src="\/assets\/[^"]+\.js"/g)?.[0]?.replace('src="','').replace('"','')
const targets = [...assets, js || '/assets/index.js']

console.log('\nAFW QA — HEAD checks\n')
for (const p of targets){
  const res = await head(base + p)
  console.log(res.status, res.type.padEnd(28), p)
}
