AFW Content Tooling
===================
These scripts help you maintain content manifests offline (no network).

Commands (run from repo root):
------------------------------
Devotionals: update manifest by scanning /public/content/devotionals/YYYY-MM/*.json
  node scripts/content/publish.mjs --devotionals

Quotes: validate categories listed in /public/content/quotes.manifest.json
  node scripts/content/publish.mjs --quotes-validate

Quotes: merge categories into a single items list (optional)
  node scripts/content/publish.mjs --quotes-merge

Output:
  - Updates /public/content/devotionals.manifest.json
  - Optionally rewrites /public/content/quotes.manifest.json with { items: [...] }
  - Writes scripts/content/last-run.json with details
