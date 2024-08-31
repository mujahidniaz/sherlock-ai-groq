#!/bin/bash
docker compose down
mkdir -p app_data
mkdir -p data
docker pull mujahid002/sherlock-ai-frontend-groq
docker pull mujahid002/sherlock-ai-backend-groq
docker compose up -d
