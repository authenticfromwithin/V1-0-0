#!/usr/bin/env node
// AFW — Generate sitemap.txt for SPA (basic routes).
// Edit BASE if deploying under a custom domain later.
import fs from "node:fs";
import path from "node:path";

const BASE = ""; // leave empty → relative root; Vercel will serve at your domain root

const routes = [
  "/",
  "/healing",
  "/journey",
  "/devotionals",
  "/quotes",
  "/guide",
  "/qa"
];

const lines = routes.map(r => BASE + r).join("\n") + "\n";
fs.writeFileSync(path.join("public","sitemap.txt"), lines, "utf-8");
console.log("Wrote public/sitemap.txt with", routes.length, "routes");
