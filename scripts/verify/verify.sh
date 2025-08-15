#!/usr/bin/env bash
# AFW Verify runner (*nix/mac)
set -euo pipefail
cd "$(dirname "$0")/../.."
node scripts/verify/verify.mjs
