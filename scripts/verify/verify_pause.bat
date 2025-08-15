@echo off
setlocal
REM This script lives in: ...\scripts\verify\verify_pause.bat
REM It jumps to the project root, runs the verifier, and then pauses.

REM Go to project root (two levels up from scripts\verify)
cd /d "%~dp0..\.."

echo.
echo === AFW Verify (pause) ===
echo Working dir: %cd%
echo Running: node scripts\verify\verify.mjs
echo.

node scripts\verify\verify.mjs

echo.
echo === Done. Press any key to close... ===
pause >nul
