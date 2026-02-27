#!/bin/sh
set -e
cd "$(dirname "$0")/.."

if [ ! -f .env.dev ]; then
    cp .env.dev.example .env.dev
    echo "Created .env.dev from .env.dev.example"
fi

echo "Starting app (dev)..."
docker compose -f docker-compose.dev.yml up -d --build web
echo "App (dev): http://localhost:5173"
