AFW Narration Tracks — Drop-in Guide
====================================

1) Record in the browser via /tools/narrate (outputs .ogg or .webm depending on your browser).
2) Place files at: public/narration/tracks/YYYY-MM-DD.ogg (or .webm)
3) Our player prefers in order: .mp3, then .ogg. If you need MP3 for Safari, convert locally with ffmpeg:

   ffmpeg -i 2025-03-01.ogg -c:a libmp3lame -b:a 128k 2025-03-01.mp3

4) Keep filenames exact (YYYY-MM-DD). Captions should exist at public/narration/captions/<same>.vtt.
