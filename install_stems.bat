@echo off
REM AFW Stems Installer (.BAT) — installs 5 ambience stems into all themes.
setlocal enabledelayedexpansion

REM Detect project root (this .bat should sit in the project root)
set "ROOT=%~dp0"
if not exist "%ROOT%package.json" (
  echo [ERROR] Can't find package.json at "%ROOT%".
  echo Move this installer into your project root (the folder with package.json) and run again.
  pause
  exit /b 1
)
echo Project root: %ROOT%

REM Choose downloader
where curl >nul 2>&1
if %errorlevel%==0 (
  set "DL=curl -L --fail --silent --show-error -o"
) else (
  echo curl.exe not found, using PowerShell fallback...
  set "DL=powershell -NoProfile -Command Invoke-WebRequest -UseBasicParsing -OutFile"
)

REM URLs (CC0/public-domain friendly)
set "URL_WATER=https://archive.org/download/ocean-sea-sounds/Gentle%%20Ocean.mp3"
set "URL_WIND=https://archive.org/download/Red_Library_Nature_Wind/R22-11-Blustery%%20Wind%%20Loop.mp3"
set "URL_BIRDS=https://archive.org/download/various-bird-sounds/birds-in-the-morning-24147.mp3"
set "URL_LEAVES=https://archive.org/download/various-bird-sounds/birds-singing-in-and-leaves-rustling-with-the-wind-14557.mp3"
set "URL_PAD=https://archive.org/download/hour-of-pink-noise/01-pink_noise.mp3"

set THEMES=forest ocean mountain autumn snow
for %%T in (%THEMES%) do (
  set "BASE=%ROOT%public\assets\audio\%%T\stems"
  if not exist "!BASE!" mkdir "!BASE!"
  echo.
  echo === Installing stems for theme: %%T ===
  echo Downloading water -> "!BASE!\water.mp3"
  %DL% "!BASE!\water.mp3" "%URL_WATER%"
  echo Downloading wind  -> "!BASE!\wind.mp3"
  %DL% "!BASE!\wind.mp3" "%URL_WIND%"
  echo Downloading birds -> "!BASE!\birds.mp3"
  %DL% "!BASE!\birds.mp3" "%URL_BIRDS%"
  echo Downloading leaves-> "!BASE!\leaves.mp3"
  %DL% "!BASE!\leaves.mp3" "%URL_LEAVES%"
  echo Downloading pad   -> "!BASE!\pad.mp3"
  %DL% "!BASE!\pad.mp3" "%URL_PAD%"
)

echo.
echo Done. Re-run your auditor:
echo   node scripts\audit-tree.mjs
pause
