# 🐳 Docker Deployment Guide

This guide covers how to deploy the AI Text Clean application using Docker.

## 📁 Docker Files Structure

```
DockerConfig/
├── Dockerfile              # Docker container configuration
├── docker-compose.yml      # Docker Compose setup
├── nginx.conf              # Nginx server configuration
├── run-docker.sh           # Linux/Mac Docker runner script
├── run-docker.bat          # Windows Docker runner script
├── .dockerignore           # Docker build exclusions
└── docker.md               # This documentation
```

## ✨ Features

### 🔒 Security
- Security headers (XSS protection, frame options, CSP)
- Hidden nginx version
- Access controls for hidden/backup files
- Content Security Policy implementation

### ⚡ Performance
- Gzip compression for all text assets
- Aggressive caching for static files (1 year)
- Short caching for HTML (1 hour)
- Optimized nginx worker settings
- TCP optimizations (sendfile, tcp_nopush, tcp_nodelay)

### 📊 Monitoring
- Health check endpoint at `/health`
- Docker health checks with retry logic
- Comprehensive logging setup
- Access and error log separation

### 🚀 Production Ready
- Custom error pages (redirect to app)
- SPA routing support (`try_files`)
- Proper MIME types for all file types
- Client upload limits
- Alpine Linux base for smaller image size

## 🚀 Quick Start

### Prerequisites
- Docker installed and running
- Port 8080 available (or modify the port mapping)

### Option 1: Automated Scripts

**Windows Users:**
```cmd
cd DockerConfig
run-docker.bat
```

**Linux/Mac Users:**
```bash
cd DockerConfig
chmod +x run-docker.sh
./run-docker.sh
```

### Option 2: Docker Compose (Recommended)
```bash
cd DockerConfig
docker-compose up -d
```

### Option 3: Manual Docker Commands
```bash
cd DockerConfig
docker build -t ai-text-clean:latest .
docker run -d --name ai-text-clean -p 8080:80 ai-text-clean:latest
```

## 🌐 Access Points

- **Main Application**: http://localhost:8080
- **Health Check**: http://localhost:8080/health

## 📋 Management Commands

### Basic Operations
```bash
# View container logs
docker logs ai-text-clean

# Follow logs in real-time
docker logs -f ai-text-clean

# Stop the container
docker stop ai-text-clean

# Start the container
docker start ai-text-clean

# Restart the container
docker restart ai-text-clean

# Remove the container
docker rm ai-text-clean

# Remove the image
docker rmi ai-text-clean:latest
```

### Docker Compose Operations
```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f

# Rebuild and restart
docker-compose up -d --build

# Scale the service (if needed)
docker-compose up -d --scale text-cleaner=3
```

### Health Monitoring
```bash
# Check health status
curl http://localhost:8080/health

# Check container health
docker inspect --format='{{.State.Health.Status}}' ai-text-clean

# View health check logs
docker inspect --format='{{range .State.Health.Log}}{{.Output}}{{end}}' ai-text-clean
```

## ⚙️ Configuration

### Environment Variables
You can customize the deployment using environment variables:

```yaml
# In docker-compose.yml
environment:
  - NGINX_HOST=localhost
  - NGINX_PORT=80
```

### Port Mapping
To use a different port, modify the port mapping:

```bash
# Use port 3000 instead of 8080
docker run -d --name ai-text-clean -p 3000:80 ai-text-clean:latest
```

### Volume Mounting
To persist logs or provide custom configuration:

```bash
# Mount logs directory
docker run -d --name ai-text-clean -p 8080:80 -v ./logs:/var/log/nginx ai-text-clean:latest

# Mount custom nginx config
docker run -d --name ai-text-clean -p 8080:80 -v ./custom-nginx.conf:/etc/nginx/nginx.conf ai-text-clean:latest
```

## 🔧 Customization

### Custom Nginx Configuration
1. Copy `nginx.conf` to `custom-nginx.conf`
2. Modify settings as needed
3. Mount the custom config when running:
   ```bash
   docker run -d --name ai-text-clean -p 8080:80 -v ./custom-nginx.conf:/etc/nginx/nginx.conf ai-text-clean:latest
   ```

### SSL/HTTPS Setup
To add SSL support, modify the nginx configuration:

```nginx
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    
    # SSL configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    
    # Rest of configuration...
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    return 301 https://$server_name$request_uri;
}
```

## 🚀 Production Deployment

### Cloud Platforms

**AWS ECS/Fargate:**
```bash
# Build and tag for AWS ECR
docker build -t your-account.dkr.ecr.region.amazonaws.com/ai-text-clean:latest .
docker push your-account.dkr.ecr.region.amazonaws.com/ai-text-clean:latest
```

**Google Cloud Run:**
```bash
# Build and tag for Google Container Registry
docker build -t gcr.io/your-project/ai-text-clean:latest .
docker push gcr.io/your-project/ai-text-clean:latest
gcloud run deploy --image gcr.io/your-project/ai-text-clean:latest
```

**Azure Container Instances:**
```bash
# Build and tag for Azure Container Registry
docker build -t yourregistry.azurecr.io/ai-text-clean:latest .
docker push yourregistry.azurecr.io/ai-text-clean:latest
```

### Kubernetes Deployment
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: ai-text-clean
spec:
  replicas: 3
  selector:
    matchLabels:
      app: ai-text-clean
  template:
    metadata:
      labels:
        app: ai-text-clean
    spec:
      containers:
      - name: ai-text-clean
        image: ai-text-clean:latest
        ports:
        - containerPort: 80
        livenessProbe:
          httpGet:
            path: /health
            port: 80
          initialDelaySeconds: 30
          periodSeconds: 10
---
apiVersion: v1
kind: Service
metadata:
  name: ai-text-clean-service
spec:
  selector:
    app: ai-text-clean
  ports:
  - port: 80
    targetPort: 80
  type: LoadBalancer
```

## 🔍 Troubleshooting

### Common Issues

**Port Already in Use:**
```bash
# Find what's using port 8080
netstat -tulpn | grep 8080
# Use a different port
docker run -d --name ai-text-clean -p 8081:80 ai-text-clean:latest
```

**Container Won't Start:**
```bash
# Check container logs
docker logs ai-text-clean
# Check container status
docker ps -a
```

**Permission Issues (Linux/Mac):**
```bash
# Make scripts executable
chmod +x run-docker.sh
# Fix Docker permissions
sudo usermod -aG docker $USER
```

**Build Failures:**
```bash
# Clean Docker cache
docker system prune -a
# Check Dockerfile syntax
docker build --no-cache -t ai-text-clean:latest .
```

### Performance Optimization

**For High Traffic:**
1. Increase worker processes in nginx.conf
2. Adjust worker connections
3. Use multiple container instances
4. Implement load balancing

**For Low Memory:**
1. Use nginx:alpine-slim base image
2. Reduce worker processes to 1
3. Lower worker connections
4. Disable access logging for static files

## 📊 Monitoring and Logging

### Log Analysis
```bash
# Nginx access logs
docker exec ai-text-clean tail -f /var/log/nginx/access.log

# Nginx error logs
docker exec ai-text-clean tail -f /var/log/nginx/error.log

# Container system logs
docker logs ai-text-clean --since 1h
```

### Metrics Collection
For production monitoring, consider integrating:
- Prometheus for metrics collection
- Grafana for visualization
- ELK stack for log analysis
- New Relic or Datadog for APM

## 🔄 Updates and Maintenance

### Updating the Application
```bash
# Pull latest changes
git pull origin main

# Rebuild container
docker-compose down
docker-compose build --no-cache
docker-compose up -d

# Or with manual Docker
docker stop ai-text-clean
docker rm ai-text-clean
docker build -t ai-text-clean:latest .
docker run -d --name ai-text-clean -p 8080:80 ai-text-clean:latest
```

### Backup and Restore
```bash
# Backup container configuration
docker inspect ai-text-clean > ai-text-clean-backup.json

# Export image
docker save ai-text-clean:latest > ai-text-clean-image.tar

# Import image
docker load < ai-text-clean-image.tar
```

## 📞 Support

If you encounter issues with the Docker deployment:

1. Check the container logs: `docker logs ai-text-clean`
2. Verify the health endpoint: `curl http://localhost:8080/health`
3. Check port availability: `netstat -tulpn | grep 8080`
4. Ensure Docker is running: `docker version`
5. Try rebuilding with no cache: `docker build --no-cache -t ai-text-clean .`

---

**Happy Dockerizing! 🐳**