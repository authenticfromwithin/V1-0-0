@echo off
REM AFW Verify runner (Windows)
setlocal
cd /d %~dp0\..\..
node scripts\verify\verify.mjs
if %errorlevel% neq 0 (
  echo.
  echo Some checks FAILED. See scripts\verify\last-report.json
  exit /b 1
) else (
  echo All checks passed.
)
