@echo off
setlocal
cd /d "%~dp0"
if not exist "dist\index.html" (
  echo dist\index.html was not found.
  echo Please make sure this ZIP was extracted fully.
  pause
  exit /b 1
)
where py >nul 2>nul
if %errorlevel%==0 (
  start "" http://127.0.0.1:5500/
  cd dist
  py -3 -m http.server 5500 --bind 127.0.0.1
  exit /b
)
where python >nul 2>nul
if %errorlevel%==0 (
  start "" http://127.0.0.1:5500/
  cd dist
  python -m http.server 5500 --bind 127.0.0.1
  exit /b
)
echo Python was not found. Opening the file directly as a fallback.
start "" "%~dp0dist\index.html"
pause
