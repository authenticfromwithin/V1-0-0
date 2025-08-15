@echo off
setlocal
REM This script writes verifier output to verify_output.txt and opens it in Notepad.
REM Place this file anywhere inside the project; it will jump to the project root.

REM Try jumping to project root if this .bat is in scripts\verify
if exist "%~dp0..\..\scripts\verify\verify.mjs" (
  cd /d "%~dp0..\.."
) else (
  REM Otherwise assume we're already at project root
)

echo Writing output to verify_output.txt ...
node scripts\verify\verify.mjs > verify_output.txt 2>&1

echo Opening verify_output.txt in Notepad ...
start notepad verify_output.txt
