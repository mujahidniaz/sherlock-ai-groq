#!/bin/bash

# Create the necessary directories if they don't exist
mkdir -p app_data
mkdir -p data
docker compose down
docker compose  -f docker-compose_mac.yml  up --build -d