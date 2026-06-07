@echo off
cd /d "%~dp0"
echo Starting HealthBuddy AI...
echo.
where npm >nul 2>nul
if errorlevel 1 (
  echo Node.js/npm is not installed. Install Node.js LTS first.
  pause
  exit /b 1
)
if not exist node_modules\vite (
  echo Installing project packages. This may take a few minutes...
  npm install --no-audit --no-fund
  if errorlevel 1 (
    echo.
    echo npm install failed. Try using pnpm:
    echo corepack enable
    echo corepack prepare pnpm@latest --activate
    echo pnpm install
    echo pnpm dev
    pause
    exit /b 1
  )
)
echo Opening local website at http://localhost:3000
start http://localhost:3000
npm run dev
pause
