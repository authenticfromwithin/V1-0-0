#!/usr/bin/env node
// AFW — Final QA predeploy checks
// Node 22.x recommended
import fs from "node:fs";
import path from "node:path";
import url from "node:url";

const root = process.cwd();
const join = (...p)=>path.join(root, ...p);

const THEMES = ["forest","ocean","mountain","autumn","snow"];
const STEMS = ["wind","water","leaves","birds","pad"];
const REQUIRED_PAGES = [
  "src/pages/Home.tsx",
  "src/pages/Healing.tsx",
  "src/pages/Journey.tsx",
  "src/pages/Devotionals.tsx",
  "src/pages/Quotes.tsx",
  "src/pages/NotFound.tsx"
];
const REQUIRED_COMPONENTS = [
  "src/components/SceneParallax/Parallax.tsx",
  "src/components/PolicyBanner.tsx",
  "src/components/AudioMixer/Controls.tsx",
  "src/components/MoodWheel/MoodWheel.tsx",
  "src/components/ui/Button.tsx",
  "src/components/ui/ThemeToggle.tsx",
  "src/components/AvatarPlayer/Player.tsx"
];
const REQUIRED_STYLES = [
  "src/styles/index.ts",
  "src/styles/tokens.css",
  "src/styles/scene.css",
  "src/styles/globals.css"
];
const REQUIRED_CORE = [
  "package.json",
  "vite.config.ts",
  "tsconfig.json",
  "index.html",
  "vercel.json"
];

const outPath = join("scripts","qa","last-predeploy.json");
const report = { ok:[], warn:[], fail:[], counts:{} };

function ok(msg){ report.ok.push(msg); console.log("[OK] " + msg); }
function warn(msg){ report.warn.push(msg); console.log("[WARN] " + msg); }
function fail(msg){ report.fail.push(msg); console.log("[FAIL] " + msg); }

function has(rel){ return fs.existsSync(join(rel)); }
function any(...rels){ return rels.some(has); }

// Core files
for (const f of REQUIRED_CORE){
  has(f) ? ok("core: " + f) : fail("core missing: " + f);
}

// Pages, components, styles
for (const f of REQUIRED_PAGES){ has(f) ? ok("page: " + f) : fail("page missing: " + f); }
for (const f of REQUIRED_COMPONENTS){ has(f) ? ok("component: " + f) : fail("component missing: " + f); }
for (const f of REQUIRED_STYLES){ has(f) ? ok("style: " + f) : fail("style missing: " + f); }

// Scenes (plates)
for (const t of THEMES){
  const base = `public/assets/scenes/${t}/plates`;
  const trio = ["back.webp","mid.webp","front.webp"].map(n => `${base}/${n}`);
  if (trio.every(has)) ok(`scene plates OK: ${t}`);
  else fail(`scene plates missing: ${t}`);
}

// Stems (MP3 only rule)
for (const t of THEMES){
  let mp3ok = true;
  for (const s of STEMS){
    const p = `public/assets/audio/${t}/stems/${s}.mp3`;
    if (!has(p)) { mp3ok = false; fail(`stem missing: ${t} → ${s}.mp3`); }
  }
  if (mp3ok) ok(`stems OK (mp3): ${t}`);

  // WAV dangling check
  for (const s of STEMS){
    const wav = `public/assets/audio/${t}/stems/${s}.wav`;
    if (has(wav)) warn(`dangling WAV present (delete recommended): ${wav}`);
  }
}

// Content manifests
if (has("public/content/quotes.manifest.json")) ok("content: quotes.manifest.json");
else fail("content missing: public/content/quotes.manifest.json");

if (has("public/content/devotionals.manifest.json")) ok("content: devotionals.manifest.json");
else fail("content missing: public/content/devotionals.manifest.json");

// Narration
const capDir = "public/narration/captions";
const trackDir = "public/narration/tracks";
if (has(capDir)) ok("narration: captions folder");
else fail("narration missing: " + capDir);
if (!has(trackDir)) warn("narration: tracks folder missing (ok if not using audio yet)");
else ok("narration: tracks folder");

if (has(capDir)){
  const files = fs.readdirSync(join(capDir)).filter(f => f.endsWith(".vtt"));
  report.counts.captions = files.length;
  if (files.length >= 300) ok(`captions present: ${files.length}`);
  else warn(`few captions present: ${files.length}`);
}

// Fonts check: parse public/fonts.css for url(...) and ensure files exist
if (has("public/fonts.css")){
  ok("fonts.css present");
  const css = fs.readFileSync(join("public/fonts.css"), "utf-8");
  const urls = Array.from(css.matchAll(/url\(([^)]+)\)/g)).map(m => m[1].replace(/["']/g,''));
  let missing = 0;
  for (const u of urls){
    const rel = u.startsWith("/") ? u.slice(1) : "public/" + u;
    if (!has(rel)) { missing++; fail("font file missing referenced in fonts.css → " + u); }
  }
  if (missing === 0) ok("all font files referenced by fonts.css are present");
} else {
  warn("public/fonts.css not found");
}

// Avatar baseline presence
function avatarCheck(rig, state){
  const webm = `public/assets/avatars/${rig}/${state}/webm/${state}.webm`;
  const mp4  = `public/assets/avatars/${rig}/${state}/mp4/${state}.mp4`;
  if (any(webm, mp4)) ok(`avatar ok: ${rig}/${state}`);
  else fail(`avatar missing: ${rig}/${state}`);
}
for (const s of ["idle","walk","sit_pray"]) avatarCheck("healing", s);
for (const s of ["idle","walk","pray"]) avatarCheck("journey", s);

// Summary & write report
const summary = {
  ok: report.ok.length,
  warn: report.warn.length,
  fail: report.fail.length,
  counts: report.counts
};
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify({ summary, report }, null, 2), "utf-8");

console.log("\n==== SUMMARY ====");
console.log(JSON.stringify(summary, null, 2));

if (report.fail.length > 0){
  process.exitCode = 1;
}
