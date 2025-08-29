@echo off
setlocal enabledelayedexpansion
title AFW — Pack 2: Journey Rig P2 + Variant Grid (Installer)

echo.
echo This installer places your Journey P2 clips into:
echo   public\assets\avatars\journey\<state>\webm\<state>.webm
echo   public\assets\avatars\journey\<state>\mp4\<state>.mp4
echo And drops a poster JPG:
echo   public\assets\avatars\journey\<state>\stills\<state>.jpg
echo.
echo It also installs per-state variant grid tiles:
echo   public\assets\avatars\journey\variants\<state>\tiles\variant-0X.jpg
echo.
echo P2 States: kneel, reflect, read_devotional
echo (We don't touch idle/walk/pray clips you already have.)
echo.

set /p ROOT=Paste your AFW project root (folder with package.json) and press Enter: 
if "%ROOT%"=="" ( echo You must enter a path. & pause & exit /b 1 )
if not exist "%ROOT%\package.json" (
  echo [ERROR] package.json not found at "%ROOT%"
  pause & exit /b 1
)

echo.
set /p SRC_WEBM=Folder that holds WEBM clips (*.webm): 
if "%SRC_WEBM%"=="" ( echo You must enter a path. & pause & exit /b 1 )
if not exist "%SRC_WEBM%" ( echo [ERROR] Not found: "%SRC_WEBM%" & pause & exit /b 1 )

set /p SRC_MP4=Folder that holds MP4 clips (*.mp4): 
if "%SRC_MP4%"=="" ( echo You must enter a path. & pause & exit /b 1 )
if not exist "%SRC_MP4%" ( echo [ERROR] Not found: "%SRC_MP4%" & pause & exit /b 1 )

REM Copy variant tiles (already in pack) into project
echo.
echo Installing variant grid tiles...
xcopy /E /I /Y "%~dp0public\assets\avatars\journey\variants" "%ROOT%\public\assets\avatars\journey\variants" >nul
echo  [OK] Variant tiles installed.

REM Poster path
set POSTER="%~dp0afw-poster-journey.jpg"

set STATES=kneel reflect read_devotional
for %%S in (%STATES%) do (
  echo.
  echo === Installing state: %%S ===

  set "DSTW=%ROOT%\public\assets\avatars\journey\%%S\webm"
  set "DSTM=%ROOT%\public\assets\avatars\journey\%%S\mp4"
  set "DSTS=%ROOT%\public\assets\avatars\journey\%%S\stills"

  if not exist "!DSTW!" mkdir "!DSTW!" >nul
  if not exist "!DSTM!" mkdir "!DSTM!" >nul
  if not exist "!DSTS!" mkdir "!DSTS!" >nul

  set "FOUND_WEBM="
  for %%G in ("%SRC_WEBM%\*%%S*.webm") do if not defined FOUND_WEBM set "FOUND_WEBM=%%~fG"
  if defined FOUND_WEBM (
    copy /Y "!FOUND_WEBM!" "!DSTW!\%%S.webm" >nul
    echo  [OK] WEBM -> journey\%%S\webm\%%S.webm
  ) else (
    echo  [MISS] WEBM for %%S not found in "%SRC_WEBM%"
  )

  set "FOUND_MP4="
  for %%G in ("%SRC_MP4%\*%%S*.mp4") do if not defined FOUND_MP4 set "FOUND_MP4=%%~fG"
  if defined FOUND_MP4 (
    copy /Y "!FOUND_MP4!" "!DSTM!\%%S.mp4" >nul
    echo  [OK] MP4  -> journey\%%S\mp4\%%S.mp4
  ) else (
    echo  [MISS] MP4 for %%S not found in "%SRC_MP4%"
  )

  copy /Y %POSTER% "!DSTS!\%%S.jpg" >nul
  echo  [OK] Poster -> journey\%%S\stills\%%S.jpg
)

echo.
echo Done. Now run your auditor:
echo   node scripts\audit-tree.mjs
echo Look for: [OK] clips:journey
pause
