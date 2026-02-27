#!/bin/sh
set -e
cd "$(dirname "$0")/.."

if [ ! -f .env.prod ]; then
    cp .env.prod.example .env.prod
    echo "Created .env.prod from .env.prod.example"
fi

echo "Starting app (prod)..."
docker compose --env-file .env.prod -f docker-compose.prod.yml up -d --build web
echo "App (prod): http://localhost:80"
