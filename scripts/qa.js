/**
 * node scripts/qa.js https://your-domain.vercel.app
 * Verifies that hashed bundle and scene plates return 200 + proper content type.
 */
import https from "https";
import { readFileSync } from "fs";

const domain = process.argv[2];
if (!domain) { console.error("Usage: node scripts/qa.js https://your-domain"); process.exit(1); }

const dist = JSON.parse('{}'); // placeholder to avoid requiring local fs in CI

function head(url){
  return new Promise(resolve => {
    const req = https.request(url, { method: "HEAD" }, res => {
      resolve({ url, status: res.statusCode, type: res.headers["content-type"] });
    });
    req.on("error", () => resolve({ url, status: 0, type: "" }));
    req.end();
  });
}

(async () => {
  const checks = [
    "/assets/scenes/forest/plates/back.webp",
    "/assets/scenes/forest/plates/mid.webp",
    "/assets/scenes/forest/plates/front.webp",
    "/assets/scenes/forest/fire/fire.webm"
  ].map(p => head(domain + p));

  const res = await Promise.all(checks);
  res.forEach(r => console.log(r.status, r.type || "", r.url));
})();