AFW Content Integrity Checker
=============================

What this verifies
------------------
1) Scenes: back/mid/front plates per theme
2) Audio: 5 stems per theme (wind, water, leaves, birds, pad)
3) Avatars: both MP4 and WEBM presence for default Healing/Journey states
4) Content: devotionals manifest + monthly JSON files; quotes manifest; guide manifest + sections
5) Narration: .mp3/.ogg + .vtt presence per devotional id

How to run
----------
Windows (PowerShell):
  .\scripts\verify\verify.ps1        # prints report
  .\scripts\verify\verify.ps1 -ToFile  # also saves a text copy

macOS/Linux:
  bash scripts/verify/verify.sh

Direct (Node 22+):
  node scripts/verify/verify.mjs

Output
------
- Console table with OK/MISSING per category
- JSON report at: scripts/verify/last-report.json
- Optional text report at: scripts/verify/last-report.txt

Notes
-----
- Missing fonts do not count as errors (local system fonts are used); fetch fonts pack fills them in.
- Archetype/variant folders for avatars are optional; the checker only requires the default paths.
