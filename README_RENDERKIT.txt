AFW Avatar RenderKit — Node22 + Vite (Replace-only, no rewiring)

Purpose
-------
Provide exact file naming, shot lists, and encoding scripts so your rendered clips
(UE5/Blender/etc.) land in the *correct* folders with correct codecs — no code changes later.

Output Targets
--------------
Resolution: 1920x1080
FPS: 30 (locked)
Loopable: yes for loop states; trim heads/tails for seamless loops
Formats per clip:
  - WEBM VP9:  crf=28 (visual), pix_fmt=yuv420p, audio=none, keyint=60, speed=1
  - MP4 H.264: crf=18, preset=medium, profile=high, level=4.1, pix_fmt=yuv420p, audio=none, keyint=60

Directory Targets
-----------------
Healing (variant-aware):
  public/assets/avatars/healing/<state>/{webm,mp4}/<state>.<ext>
  public/assets/avatars/healing/<state>/set-a/{webm,mp4}/<state>.<ext>
  public/assets/avatars/healing/<state>/set-b/{webm,mp4}/<state>.<ext>

Journey:
  public/assets/avatars/journey/<state>/{webm,mp4}/<state>.<ext>

States — Healing:
  idle(loop), walk(loop), stretch(action), drink(action), sit_pray(loop), pick_eat_fruit(action)

States — Journey:
  idle(loop), walk(loop), kneel(action), pray(loop), read_devotional(loop), reflect(action)

How to Use
----------
1) Render EXR/PNG or MOV (ProRes) from your DCC.
2) Run the encoding scripts below to generate both WEBM and MP4 with correct names/paths.
3) Run verify to see a friendly report of what’s present or missing.

Encoding (Windows .bat)
-----------------------
- scripts\encode-healing.bat  <state>  <input.mov>  [set-a|set-b]
- scripts\encode-journey.bat  <state>  <input.mov>

Examples:
  scripts\encode-healing.bat  sit_pray  R:\renders\sit_pray.mov  set-b
  scripts\encode-journey.bat  pray      R:\renders\journey_pray.mov

Requirements: ffmpeg in PATH. Get it from https://ffmpeg.org/

Verification
------------
- scripts\verify-clips.json  (what we expect)
- scripts\verify-clips.mjs   (Node 18+ OK; Node 22 used here)

Run:
  node scripts\verify-clips.mjs

This prints a checklist. Only 'missing' means action needed.
