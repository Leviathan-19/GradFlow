#!/bin/bash
# User Data script template for EC2 instances
# Variables are injected by Terraform templatefile() function

set -euo pipefail

export DEBIAN_FRONTEND=noninteractive

LOG_FILE="/var/log/user_data.log"
exec > >(tee -a $LOG_FILE)
exec 2>&1

echo "=== User Data Script Started ==="
echo "Timestamp: $(date)"

# Install Docker
apt-get update -y
apt-get install -y docker.io curl jq

systemctl enable docker
systemctl start docker

# Allow docker without sudo
usermod -aG docker ubuntu

echo "Docker installed: $(docker --version)"

# Docker login if credentials provided
if [ -n "${docker_registry}" ] && [ -n "${docker_registry_username}" ] && [ -n "${docker_registry_password}" ]; then
  echo "${docker_registry_password}" | docker login "${docker_registry}" -u "${docker_registry_username}" --password-stdin || true
  echo "Docker registry login completed"
fi

# Docker Hub login if credentials provided
if [ -n "${dockerhub_username}" ] && [ -n "${dockerhub_token}" ]; then
  echo "${dockerhub_token}" | docker login -u "${dockerhub_username}" --password-stdin || true
  echo "Docker Hub login completed"
fi

# Create .env file with Terraform variables
cat > /home/ubuntu/.env <<ENVFILE
# Database Configuration
DB_HOST=${db_host}
DB_USER=${db_user}
DB_PASSWORD=${db_password}
DB_NAME=${db_name}
DB_PORT=${db_port}

# Service Configuration
PORT=${docker_container_port}
NODE_ENV=production

# API Gateway URL (use Load Balancer DNS)
API_GATEWAY_URL=http://${loadbalancer_dns}

# Service URLs (use Load Balancer DNS for all services)
USERS_CREATE_URL=http://${loadbalancer_dns}
USERS_DELETE_URL=http://${loadbalancer_dns}
USERS_LIST_URL=http://${loadbalancer_dns}
USERS_SEARCH_URL=http://${loadbalancer_dns}
USERS_UPDATE_URL=http://${loadbalancer_dns}
AUTH_LOGIN_URL=http://${loadbalancer_dns}
AUTH_ROL_URL=http://${loadbalancer_dns}
AUTH_ME_URL=http://${loadbalancer_dns}
FILE_SERVICE_INIT_URL=http://${loadbalancer_dns}
FILE_SERVICE_UPDATE_URL=http://${loadbalancer_dns}
FILE_SERVICE_UPLOAD_URL=http://${loadbalancer_dns}
FILE_SERVICE_LIST_URL=http://${loadbalancer_dns}
FILE_SERVICE_DOWNLOAD_URL=http://${loadbalancer_dns}

# JWT Configuration
JWT_SECRET=${jwt_secret}
JWT_EXPIRES_IN=24h

# Docker Registry
DOCKER_REGISTRY=${docker_registry}
DOCKER_REGISTRY_USERNAME=${docker_registry_username}
DOCKER_REGISTRY_PASSWORD=${docker_registry_password}
ENVFILE

chown ubuntu:ubuntu /home/ubuntu/.env
chmod 600 /home/ubuntu/.env

echo ".env file created at /home/ubuntu/.env"
echo "Load Balancer DNS: ${loadbalancer_dns}"

# Pull Docker image if specified
if [ -n "${docker_image}" ]; then
  echo "Pulling Docker image: ${docker_image}"
  docker pull "${docker_image}" || echo "Warning: Failed to pull image ${docker_image}"
fi

# Stop and remove existing container if exists
docker stop app 2>/dev/null || true
docker rm app 2>/dev/null || true

# Run Docker container
if [ -n "${docker_image}" ]; then
  echo "Starting container from image: ${docker_image}"
  docker run -d \
    --name app \
    --restart always \
    -p 80:${docker_container_port} \
    --env-file /home/ubuntu/.env \
    "${docker_image}" || echo "Warning: Failed to start container"
  
  echo "Container started. Status:"
  docker ps --filter "name=app" --format "{{.Names}}: {{.Status}}"
fi

# Cleanup unused images
docker image prune -a -f || true

echo "=== User Data Script Completed ==="
echo "Timestamp: $(date)"
