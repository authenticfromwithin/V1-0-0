#!/usr/bin/env node
// AFW — Asset lint: find leftovers, suspicious files, and heavy assets
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const join = (...p)=>path.join(root, ...p);

const findings = [];
function add(type, msg){ findings.push({ type, msg }); console.log(`[${type}] ${msg}`); }

function walk(dir){
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries){
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else {
      // Flag non-web formats under public
      if (p.includes(path.sep + "public" + path.sep)){
        if (/\.(mov|mkv|wav|aiff|flac)$/i.test(p)) add("WARN", "heavy/non-web format in public: " + p);
        if (/\.(png|jpg|jpeg)$/i.test(p) && /\/plates\//.test(p.replaceAll("\\","/"))) add("WARN","plate image is not webp: "+p);
      }
      // Heuristic: any file > ~8MB under public
      try {
        const stat = fs.statSync(p);
        if (p.includes(path.sep + "public" + path.sep) && stat.size > 8*1024*1024){
          add("WARN", `large asset (>8MB): ${p} (${Math.round(stat.size/1024/1024)} MB)`);
        }
      } catch {}
    }
  }
}

if (fs.existsSync(join("public"))) walk(join("public"));

fs.mkdirSync(join("scripts","qa"), { recursive: true });
fs.writeFileSync(join("scripts","qa","last-asset-lint.json"), JSON.stringify({ findings }, null, 2), "utf-8");
console.log("\nWrote scripts/qa/last-asset-lint.json");
