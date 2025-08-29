AFW Narration Seed Kit (Windows‑friendly, offline)
==================================================

Goal
----
Generate real **.mp3 + .ogg + .vtt** narration for your devotionals using **Windows built‑in TTS (SAPI)** — **no cloud, no API keys**. Requires **ffmpeg** for MP3/OGG conversion.

What you get
------------
- `scripts/narration-build.ps1` — PowerShell script
  - Reads a list of devotional IDs from `scripts/narration-ids.txt`
  - Loads each JSON under `public/content/devotionals/YYYY-MM/`
  - Uses Windows **SAPI.SpVoice** to synthesize a **WAV**
  - If **ffmpeg** is available, transcodes to **MP3** and **OGG**
  - Creates a simple **WebVTT** captions file with one cue spanning the full clip
- Folder targets expected by the app:
  - `public/narration/tracks/*.mp3|.ogg`
  - `public/narration/captions/*.vtt`

Prereqs (one‑time)
------------------
1) **Windows 10/11** (SAPI is built‑in). macOS/Linux users: ask me for the macOS/Linux variant.
2) **ffmpeg** installed & on PATH (https://ffmpeg.org/). If missing, the script will still output WAV and skip MP3/OGG.

How to use
----------
1) Edit `scripts/narration-ids.txt` and list devotional IDs (one per line), for example:
   devotional-2025-08-11
   devotional-2025-08-12
2) Open PowerShell at project root and run:
   `.\scripts\narration-build.ps1`
3) Check outputs under `public/narration/{tracks,captions}`.

Schema notes
------------
- The script expects each `public/content/devotionals/YYYY-MM/devotional-YYYY-MM-DD.json` to have either:
  - `title` and `body` fields, or
  - a `text` field.
- The spoken text is: `title + "\n" + first 800 characters of body/text` (to keep clip length reasonable).

Privacy
-------
- Everything runs locally. No network calls.