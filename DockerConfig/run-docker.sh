#!/bin/bash

# Build and run AI Text Clean Docker container
# Usage: ./run-docker.sh
# Run from the DockerConfig directory

set -e

echo "🧹 Building AI Text Clean Docker image..."

# Build the Docker image from parent directory
docker build -f Dockerfile -t ai-text-clean:latest ..

echo "✅ Docker image built successfully!"

echo "🚀 Starting AI Text Clean container..."

# Stop and remove existing container if it exists
docker stop ai-text-clean 2>/dev/null || true
docker rm ai-text-clean 2>/dev/null || true

# Run the container
docker run -d \
  --name ai-text-clean \
  --restart unless-stopped \
  -p 80:80 \
  ai-text-clean:latest

echo "✅ AI Text Clean is now running!"
echo "🌐 Open your browser and go to: http://localhost"
echo ""
echo "📋 Useful commands:"
echo "  - View logs: docker logs ai-text-clean"
echo "  - Stop container: docker stop ai-text-clean"
echo "  - Remove container: docker rm ai-text-clean"
echo "  - Health check: curl http://localhost/health"