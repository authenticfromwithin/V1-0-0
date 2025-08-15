@echo off
setlocal
REM Keep window open after writing output and opening Notepad.

REM Jump to project root (two levels up from scripts\verify)
cd /d "%~dp0..\.."

echo.
echo === AFW Verify (to file + hold) ===
echo CWD: %CD%
echo Running: node scripts\verify\verify.mjs
echo (Output will be saved to: %CD%\verify_output.txt)
echo.

node scripts\verify\verify.mjs > verify_output.txt 2>&1
set ERR=%ERRORLEVEL%

echo.
echo Exit Code: %ERR%
echo Opening verify_output.txt...
start "" notepad "%CD%\verify_output.txt"

echo.
echo === Press any key to close this window ===
pause >nul
exit /b %ERR%
