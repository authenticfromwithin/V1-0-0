@echo off
setlocal enabledelayedexpansion
REM Diagnostic runner that shows Node path/version and keeps window open.

REM Jump to project root (two levels up from scripts\verify)
cd /d "%~dp0..\.."

echo.
echo === AFW Verify (DEBUG) ===
echo CWD: %CD%
echo.
echo -- where node --
where node
echo.
echo -- node -v --
node -v
echo.
echo Running: node scripts\verify\verify.mjs  (logging to verify_output.txt)
echo.

node scripts\verify\verify.mjs > verify_output.txt 2>&1
set ERR=%ERRORLEVEL%

echo.
echo Exit Code: !ERR!
echo Opening verify_output.txt in Notepad...
start "" notepad "%CD%\verify_output.txt"

echo.
echo === DEBUG complete. Press any key to close ===
pause >nul
exit /b !ERR!
