#!/usr/bin/env bash
# scripts/verify/verify.sh — macOS/Linux runner
set -euo pipefail
node scripts/verify/verify.mjs | tee scripts/verify/last-report.txt
echo "Saved to scripts/verify/last-report.txt"
