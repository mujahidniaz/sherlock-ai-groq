@echo off
if not exist app_data mkdir app_data
if not exist data mkdir data
docker pull mujahid002/sherlock-ai-frontend-groq
docker pull mujahid002/sherlock-ai-backend-groq
docker-compose up --build -d
