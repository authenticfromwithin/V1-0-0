#!/usr/bin/env bash
# encode-seq-journey.sh <state> <sequencePattern: /path/to/clip_%04d.png>
set -euo pipefail
STATE="${1:?state required}"
SEQ="${2:?sequence pattern required}"
TMP="__afw_tmp_${STATE}.mov"
ffmpeg -y -framerate 30 -start_number 0 -i "${SEQ}" -c:v prores_ks -profile:v 3 -pix_fmt yuv422p10le -r 30 "${TMP}"
./scripts/encode-journey.sh "${STATE}" "${TMP}"
rm -f "${TMP}"
