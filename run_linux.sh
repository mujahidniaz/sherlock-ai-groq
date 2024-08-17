#!/bin/bash

# Create the necessary directories if they don't exist
docker compose down
mkdir -p app_data
mkdir -p data
docker pull mujahid002/sherlock-ai-frontend-groq
docker pull mujahid002/sherlock-ai-backend-groq
# Run Docker Compose with the --build flag
docker compose up -d
