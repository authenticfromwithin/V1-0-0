\
@echo off
REM encode-healing.bat <state> <input.mov> [set-a|set-b]
setlocal
if "%~1"=="" echo Usage: %~nx0 <state> <input.mov> [set-a|set-b] & exit /b 1
if "%~2"=="" echo Usage: %~nx0 <state> <input.mov> [set-a|set-b] & exit /b 1

set "STATE=%~1"
set "INPUT=%~2"
set "VAR=%~3"

REM Prefer local ffmpeg in ..\bin, fall back to PATH
set "FFMPEG=ffmpeg"
if exist "%~dp0..\bin\ffmpeg.exe" set "FFMPEG=%~dp0..\bin\ffmpeg.exe"

set "OUTDIR=public\assets\avatars\healing\%STATE%"
if not "%VAR%"=="" set "OUTDIR=%OUTDIR%\%VAR%"
if not exist "%OUTDIR%\webm" mkdir "%OUTDIR%\webm"
if not exist "%OUTDIR%\mp4"  mkdir "%OUTDIR%\mp4"

REM WEBM (VP9)
"%FFMPEG%" -y -i "%INPUT%" -an -r 30 -pix_fmt yuv420p -c:v libvpx-vp9 -b:v 0 -crf 28 -g 60 -row-mt 1 "%OUTDIR%\webm\%STATE%.webm" || (echo ERROR: webm encode failed & exit /b 1)

REM MP4 (H.264)
"%FFMPEG%" -y -i "%INPUT%" -an -r 30 -pix_fmt yuv420p -c:v libx264 -crf 18 -preset medium -profile:v high -level 4.1 -g 60 "%OUTDIR%\mp4\%STATE%.mp4" || (echo ERROR: mp4 encode failed & exit /b 1)

echo Done: %OUTDIR%\webm\%STATE%.webm and %OUTDIR%\mp4\%STATE%.mp4
