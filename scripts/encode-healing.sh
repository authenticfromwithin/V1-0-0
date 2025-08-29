#!/usr/bin/env bash
# encode-healing.sh <state> <input.mov> [set-a|set-b]
set -euo pipefail
STATE="${1:?state required}"
INPUT="${2:?input file required}"
VARIANT="${3:-}"
FFMPEG="$(cd "$(dirname "$0")/.."; pwd)/bin/ffmpeg"
if [ ! -x "$FFMPEG" ]; then FFMPEG="ffmpeg"; fi
OUTDIR="public/assets/avatars/healing/${STATE}"
if [[ -n "${VARIANT}" ]]; then OUTDIR="${OUTDIR}/${VARIANT}"; fi
mkdir -p "${OUTDIR}/webm" "${OUTDIR}/mp4"
"$FFMPEG" -y -i "${INPUT}" -an -r 30 -pix_fmt yuv420p -c:v libvpx-vp9 -b:v 0 -crf 28 -g 60 -row-mt 1 "${OUTDIR}/webm/${STATE}.webm"
"$FFMPEG" -y -i "${INPUT}" -an -r 30 -pix_fmt yuv420p -c:v libx264 -crf 18 -preset medium -profile:v high -level 4.1 -g 60 "${OUTDIR}/mp4/${STATE}.mp4"
