@echo off
REM Build and run AI Text Clean Docker container for Windows
REM Usage: run-docker.bat
REM Run from the DockerConfig directory

echo 🧹 Building AI Text Clean Docker image...

REM Build the Docker image from parent directory
docker build -f Dockerfile -t ai-text-clean:latest ..

if %ERRORLEVEL% neq 0 (
    echo ❌ Docker build failed!
    pause
    exit /b 1
)

echo ✅ Docker image built successfully!

echo 🚀 Starting AI Text Clean container...

REM Stop and remove existing container if it exists
docker stop ai-text-clean >nul 2>&1
docker rm ai-text-clean >nul 2>&1

REM Run the container
docker run -d ^
  --name ai-text-clean ^
  --restart unless-stopped ^
  -p 8080:80 ^
  ai-text-clean:latest

if %ERRORLEVEL% neq 0 (
    echo ❌ Failed to start container!
    pause
    exit /b 1
)

echo ✅ AI Text Clean is now running!
echo 🌐 Open your browser and go to: http://localhost:8080
echo.
echo 📋 Useful commands:
echo   - View logs: docker logs ai-text-clean
echo   - Stop container: docker stop ai-text-clean
echo   - Remove container: docker rm ai-text-clean
echo   - Health check: curl http://localhost:8080/health
echo.
pause