# Start app in dev mode (run from project root or with path to project)
$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot\..

if (-not (Test-Path ".env.dev")) {
    Copy-Item ".env.dev.example" ".env.dev"
    Write-Host "Created .env.dev from .env.dev.example"
}

Write-Host "Starting app (dev)..."
docker compose -f docker-compose.dev.yml up -d --build web
Write-Host "App (dev): http://localhost:5173"
