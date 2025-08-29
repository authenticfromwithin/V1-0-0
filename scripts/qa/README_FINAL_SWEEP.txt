AFW Final Sweep — How to run

1) From your project root:
   node scripts/qa/final-sweep.mjs

2) Outcome:
   - Prints a summary (errors stop deploy; warnings are non-blocking)
   - Writes a JSON report at scripts/qa/reports/final-sweep-<timestamp>.json

3) What it checks:
   - Devotionals manifest has ≥365 items for 2025 and files exist on disk
   - Quotes manifest lists ≥4 categories and each category file exists
   - Audio stems (mp3) exist for each theme (forest, ocean, mountain, autumn, snow)
   - Avatar idle clips exist for healing & journey for variant-01/02 (webm and mp4)
   - UI fonts in public/assets/fonts/ui contain .woff2 files

Tip: Run this before committing to main or kicking off a Vercel build.
