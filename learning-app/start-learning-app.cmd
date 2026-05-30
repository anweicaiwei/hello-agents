@echo off
setlocal
set "SCRIPT_DIR=%~dp0"

where pwsh >nul 2>nul
if %errorlevel%==0 (
  pwsh -NoLogo -NoProfile -ExecutionPolicy Bypass -File "%SCRIPT_DIR%start-learning-app.ps1"
  exit /b %errorlevel%
)

powershell -NoLogo -NoProfile -ExecutionPolicy Bypass -File "%SCRIPT_DIR%start-learning-app.ps1"
exit /b %errorlevel%
