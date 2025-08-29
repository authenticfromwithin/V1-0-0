@echo off
title AFW — QA: predeploy + asset lint + sitemap
echo Running predeploy checks...
node scripts\qa\predeploy.mjs
echo.
echo Running asset lint...
node scripts\qa\check-assets.mjs
echo.
echo Generating sitemap...
node scripts\qa\generate-sitemap.mjs
echo.
echo Done. See scripts\qa\last-predeploy.json and scripts\qa\last-asset-lint.json
pause
