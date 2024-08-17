#!/bin/bash

# Docker Hub Login
echo "$DOCKER_HUB_PASSWORD" | docker login -u "$DOCKER_HUB_USERNAME" --password-stdin

# Build the frontend application
#cd ./frontend
#npm install .
#npm run build
#cd ..

# Set the image name and tag for the frontend
IMAGE_NAME="mujahid002/sherlock-ai-frontend-groq"
TAG="latest"

# Build the Docker image for the frontend
docker build -t "$IMAGE_NAME":"$TAG" ./copilot-web/

# Push the frontend image to Docker Hub
docker push "$IMAGE_NAME":"$TAG"

echo "Frontend image has been built and pushed successfully."

# Set the image name and tag for the backend
IMAGE_NAME="mujahid002/sherlock-ai-backend-groq"
TAG="latest"

# Build the Docker image for the backend
docker build -t "$IMAGE_NAME":"$TAG" ./copilot-backend/

# Push the backend image to Docker Hub
docker push "$IMAGE_NAME":"$TAG"

echo "Backend image has been built and pushed successfully."
