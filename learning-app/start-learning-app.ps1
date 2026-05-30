param(
  [switch]$NoBrowser
)

$ErrorActionPreference = 'Stop'
$AppRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $AppRoot

function Test-Command($Name) {
  $null -ne (Get-Command $Name -ErrorAction SilentlyContinue)
}

Write-Host ''
Write-Host 'Hello-Agents Learning App' -ForegroundColor Cyan
Write-Host 'Working directory:' $AppRoot

if (-not (Test-Command 'npm')) {
  Write-Host 'npm was not found. Please install Node.js first.' -ForegroundColor Red
  Read-Host 'Press Enter to exit'
  exit 1
}

if (-not (Test-Path -LiteralPath (Join-Path $AppRoot 'node_modules'))) {
  Write-Host 'Installing dependencies...' -ForegroundColor Yellow
  npm install
}

Write-Host 'Generating course data...' -ForegroundColor Yellow
npm run generate

$Url = 'http://127.0.0.1:5173/'
if (-not $NoBrowser) {
  Start-Process $Url
}

Write-Host ''
Write-Host "Dev server starting at $Url" -ForegroundColor Green
Write-Host 'Keep this window open while using the app. Press Ctrl+C to stop.'
Write-Host ''

npm run dev -- --host 127.0.0.1 --port 5173
