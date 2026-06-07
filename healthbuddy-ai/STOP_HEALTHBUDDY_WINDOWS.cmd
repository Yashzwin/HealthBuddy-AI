@echo off
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5500') do taskkill /PID %%a /F >nul 2>nul
echo HealthBuddy local server stopped if it was running.
pause
