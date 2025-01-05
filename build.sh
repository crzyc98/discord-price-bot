#!/bin/bash

# Exit on any error
set -e

# Set platform for Linux compatibility
export DOCKER_DEFAULT_PLATFORM=linux/amd64

echo " Building Docker image for Linux..."
docker-compose build --no-cache

echo " Pushing Docker image to Docker Hub..."
docker push crzyc/discordpricebot:consolidated

echo " Build and push completed successfully!"
