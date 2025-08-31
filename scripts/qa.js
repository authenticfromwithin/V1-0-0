// node ./scripts/qa.js https://your-domain.vercel.app
const https = require('https');
const url = process.argv[2];
if (!url) {
  console.log('Usage: node scripts/qa.js https://domain');
  process.exit(1);
}
const targets = [
  '/assets/scenes/forest/plates/back.webp',
  '/assets/scenes/forest/plates/mid.webp',
  '/assets/scenes/forest/plates/front.webp',
  '/assets/scenes/forest/fire/fire.webm'
];
function head(u){
  return new Promise(res=>{
    https.request(u, { method:'HEAD' }, r => {
      res({ url:u, status:r.statusCode, type:r.headers['content-type'] });
    }).on('error', () => res({ url:u, status:0, type:'-' })).end();
  });
}
(async () => {
  const out = await Promise.all(targets.map(t => head(url + t)));
  console.table(out);
})();