#!/usr/bin/env bash
set -euo pipefail
ROOT="${1:-.}"

declare -A STEMS
STEMS[water]="https://archive.org/download/ocean-sea-sounds/Gentle%20Ocean.mp3"
STEMS[wind]="https://archive.org/download/Red_Library_Nature_Wind/R22-11-Blustery%20Wind%20Loop.mp3"
STEMS[birds]="https://archive.org/download/various-bird-sounds/birds-in-the-morning-24147.mp3"
STEMS[leaves]="https://archive.org/download/various-bird-sounds/birds-singing-in-and-leaves-rustling-with-the-wind-14557.mp3"
STEMS[pad]="https://archive.org/download/hour-of-pink-noise/01-pink_noise.mp3"

themes=(forest ocean mountain autumn snow)

ensure_dir() { mkdir -p "$1"; }

for theme in "${themes[@]}"; do
  base="$ROOT/public/assets/audio/$theme/stems"
  ensure_dir "$base"
  for name in "${!STEMS[@]}"; do
    url="${STEMS[$name]}"
    dest="$base/$name.mp3"
    echo "Downloading $theme/$name -> $dest"
    curl -L --fail --silent --show-error "$url" -o "$dest"
  done
done
echo "Done."
