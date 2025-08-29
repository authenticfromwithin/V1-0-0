AFW — Sequence Encoders
=======================
For when your DCC outputs image sequences (PNG/EXR). These scripts convert a numbered
sequence into a mezzanine MOV (ProRes) and then into AFW-ready WEBM+MP4 in the correct folders.

Usage (Windows, PNG sequence, 30fps)
------------------------------------
scripts\encode-seq-healing.bat  idle  C:\shots\healing_idle_####.png
scripts\encode-seq-journey.bat  pray  C:\shots\journey_pray_####.png

Usage (Mac/Linux)
-----------------
./scripts/encode-seq-healing.sh idle /shots/healing_idle_%04d.png
./scripts/encode-seq-journey.sh pray /shots/journey_pray_%04d.png

Notes
-----
- Use %04d or #### pattern depending on your file names.
- Scripts will create a temporary MOV and then call the standard encoders to produce WEBM/MP4.
- Requires ffmpeg in PATH.
