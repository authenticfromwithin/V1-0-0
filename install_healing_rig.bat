@echo off
setlocal enabledelayedexpansion
title AFW — Pack 1: Healing Rig Finalize (Installer)

echo.
echo This installer will place your Healing rig clips into the exact paths AFW expects:
echo   public\assets\avatars\healing\<state>\webm\<state>.webm
echo   public\assets\avatars\healing\<state>\mp4\<state>.mp4
echo And it will drop a poster JPG into:
echo   public\assets\avatars\healing\<state>\stills\<state>.jpg
echo.
echo States: idle, walk, stretch, drink, sit_pray, pick_eat_fruit
echo.

set /p ROOT=Paste your AFW project root (folder with package.json) and press Enter: 
if "%ROOT%"=="" ( echo You must enter a path. & pause & exit /b 1 )
if not exist "%ROOT%\package.json" (
  echo [ERROR] package.json not found at "%ROOT%"
  pause & exit /b 1
)

echo.
echo === Source folders ===
echo You can point to the same folder if it contains both formats.
set /p SRC_WEBM=Folder that holds WEBM clips (*.webm): 
if "%SRC_WEBM%"=="" ( echo You must enter a path. & pause & exit /b 1 )
if not exist "%SRC_WEBM%" ( echo [ERROR] Not found: "%SRC_WEBM%" & pause & exit /b 1 )

set /p SRC_MP4=Folder that holds MP4 clips (*.mp4): 
if "%SRC_MP4%"=="" ( echo You must enter a path. & pause & exit /b 1 )
if not exist "%SRC_MP4%" ( echo [ERROR] Not found: "%SRC_MP4%" & pause & exit /b 1 )

REM Copy poster into each state's stills as <state>.jpg
set POSTER="%~dp0afw-poster.jpg"

set STATES=idle walk stretch drink sit_pray pick_eat_fruit
for %%S in (%STATES%) do (
  echo.
  echo === Installing state: %%S ===

  set "DSTW=%ROOT%\public\assets\avatars\healing\%%S\webm"
  set "DSTM=%ROOT%\public\assets\avatars\healing\%%S\mp4"
  set "DSTS=%ROOT%\public\assets\avatars\healing\%%S\stills"

  if not exist "!DSTW!" mkdir "!DSTW!" >nul
  if not exist "!DSTM!" mkdir "!DSTM!" >nul
  if not exist "!DSTS!" mkdir "!DSTS!" >nul

  REM Find WEBM file containing the state name (first match)
  set "FOUND_WEBM="
  for %%G in ("%SRC_WEBM%\*%%S*.webm") do if not defined FOUND_WEBM set "FOUND_WEBM=%%~fG"
  if defined FOUND_WEBM (
    copy /Y "!FOUND_WEBM!" "!DSTW!\%%S.webm" >nul
    echo  [OK] WEBM -> healing\%%S\webm\%%S.webm
  ) else (
    echo  [MISS] WEBM for %%S not found in "%SRC_WEBM%"
  )

  REM Find MP4 file containing the state name (first match)
  set "FOUND_MP4="
  for %%G in ("%SRC_MP4%\*%%S*.mp4") do if not defined FOUND_MP4 set "FOUND_MP4=%%~fG"
  if defined FOUND_MP4 (
    copy /Y "!FOUND_MP4!" "!DSTM!\%%S.mp4" >nul
    echo  [OK] MP4  -> healing\%%S\mp4\%%S.mp4
  ) else (
    echo  [MISS] MP4 for %%S not found in "%SRC_MP4%"
  )

  REM Poster
  copy /Y %POSTER% "!DSTS!\%%S.jpg" >nul
  echo  [OK] Poster -> healing\%%S\stills\%%S.jpg
)

echo.
echo Done. Now run your auditor:
echo   node scripts\audit-tree.mjs
echo Look for: [OK] clips:healing
pause
