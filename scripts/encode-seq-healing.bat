\
@echo off
REM encode-seq-healing.bat <state> <sequencePattern>
setlocal
if "%~1"=="" echo Usage: %~nx0 <state> <sequencePattern> & exit /b 1
if "%~2"=="" echo Usage: %~nx0 <state> <sequencePattern> & exit /b 1

set "STATE=%~1"
set "SEQ=%~2"
set "TMP=__afw_tmp_%STATE%.mov"

REM Prefer local ffmpeg in ..\bin, fall back to PATH
set "FFMPEG=ffmpeg"
if exist "%~dp0..\bin\ffmpeg.exe" set "FFMPEG=%~dp0..\bin\ffmpeg.exe"

REM Build mezzanine MOV (ProRes)
"%FFMPEG%" -y -framerate 30 -start_number 0 -i "%SEQ%" -c:v prores_ks -profile:v 3 -pix_fmt yuv422p10le -r 30 "%TMP%" || (echo ERROR: MOV build failed & exit /b 1)

call "%~dp0encode-healing.bat" %STATE% "%TMP%" || (del "%TMP%" & exit /b 1)
del "%TMP%"
