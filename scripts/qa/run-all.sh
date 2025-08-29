#!/usr/bin/env bash
set -e
echo "AFW — QA: predeploy + asset lint + sitemap"
node scripts/qa/predeploy.mjs
node scripts/qa/check-assets.mjs
node scripts/qa/generate-sitemap.mjs
echo "Done. See scripts/qa/last-predeploy.json and scripts/qa/last-asset-lint.json"
