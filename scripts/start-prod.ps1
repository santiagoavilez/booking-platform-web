# Start app in prod mode (run from project root or with path to project)
$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot\..

if (-not (Test-Path ".env.prod")) {
    Copy-Item ".env.prod.example" ".env.prod"
    Write-Host "Created .env.prod from .env.prod.example"
}

Write-Host "Starting app (prod)..."
docker compose --env-file .env.prod -f docker-compose.prod.yml up -d --build web
Write-Host "App (prod): http://localhost:80"
