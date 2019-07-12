#!/usr/bin/env bash

echo -n "Stop previous containers..."
echo -en '\n'
docker-compose stop

# Install dependencies
echo -n "Install dependencies..."
echo -en '\n'
docker run --rm -v $(pwd)/../../:/app -w /app node:10.16.0-stretch-slim npm install

# Up docker compose
echo -n "Up docker compose..."
echo -en '\n'
docker-compose up -d


# Up docker compose
#echo -n "Run database migrations..."
#echo -en '\n'
#docker exec node-app-container-dev npm run migrate-mongo up
