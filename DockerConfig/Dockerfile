# Use the official nginx image as base
FROM nginx:alpine

# Remove default nginx website
RUN rm -rf /usr/share/nginx/html/*

# Copy the application files to nginx html directory
COPY src/ /usr/share/nginx/html/

# Create a custom nginx configuration
COPY DockerConfig/nginx.conf /etc/nginx/nginx.conf

# Expose port 80
EXPOSE 80

# Add labels for better image management
LABEL maintainer="AI Text Clean"
LABEL description="Nginx server for AI Text Clean application"
LABEL version="1.0"

# Start nginx
CMD ["nginx", "-g", "daemon off;"]