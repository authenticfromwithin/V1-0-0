@echo off
REM Force replace files before applying patch (Windows)
setlocal
git rm -f --cached scripts\copy-public-assets.mjs package.json vercel.json public\index.html tsconfig.json src\index.tsx src\App.tsx 2>NUL
del /Q scripts\copy-public-assets.mjs package.json vercel.json public\index.html tsconfig.json src\index.tsx src\App.tsx 2>NUL
git apply --check afw-replace-only-2025-08-17.patch || goto :fail
git apply --3way afw-replace-only-2025-08-17.patch || goto :fail
echo.
echo Patch applied. Stage & commit:
echo   git add -A
echo   git commit -m "Apply AFW replace-only patch"
echo.
goto :eof
:fail
echo Patch failed. Resolve conflicts, then run git add -A && git commit.
exit /b 1