#!/usr/bin/env node
// Minimal QA: HEAD a built JS and required assets
const https = require('https');
const url = require('url');

const domain = process.argv[2];
if (!domain) {
  console.error('Usage: node scripts/qa.js https://your-domain.vercel.app');
  process.exit(1);
}

function head(u) {
  return new Promise((resolve, reject) => {
    const opts = url.parse(u);
    opts.method = 'HEAD';
    const req = https.request(opts, (res) => resolve({statusCode: res.statusCode, contentType: res.headers['content-type'] || ''}));
    req.on('error', reject);
    req.end();
  });
}

(async () => {
  try {
    // pick an index-*.js name the same way vite emits
    const jsName = process.env.JS_NAME || 'index-CFLUypYc.js'; // override with env if needed
    const checks = [
      `${domain}/assets/${jsName}`,
      `${domain}/assets/scenes/forest/plates/back.webp`,
      `${domain}/assets/scenes/forest/plates/mid.webp`,
      `${domain}/assets/scenes/forest/plates/front.webp`,
      `${domain}/assets/scenes/forest/fire/fire.webm`
    ];
    for (const u of checks) {
      const r = await head(u);
      console.log(`${u} -> ${r.statusCode} ${r.contentType}`);
    }
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
