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
NODE_ENV=production

# API Gateway URL (use Load Balancer DNS - API Gateway is in another account)
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
ENVFILE

chown ubuntu:ubuntu /home/ubuntu/.env
chmod 600 /home/ubuntu/.env

echo ".env file created at /home/ubuntu/.env"
echo "Load Balancer DNS: ${loadbalancer_dns}"


# Function to stop and remove existing container
stop_and_remove_container() {
  local container_name=$1
  docker stop "$container_name" 2>/dev/null || true
  docker rm "$container_name" 2>/dev/null || true
}

# Function to pull and run container
deploy_container() {
  local container_name=$1
  local image_name=$2
  local port=$3
  local env_file="/home/ubuntu/.env"

  echo "Deploying $container_name..."

  # Stop and remove existing container
  stop_and_remove_container "$container_name"

  # Pull Docker image
  if [ -n "$image_name" ]; then
    echo "Pulling Docker image: $image_name"
    docker pull "$image_name" || {
      echo "Warning: Failed to pull image $image_name"
      return 1
    }
  else
    echo "Warning: No image specified for $container_name, skipping"
    return 1
  fi

  # Run container
  docker run -d \
    --name "$container_name" \
    --restart always \
    -p 0.0.0.0:$port:$port \
    --env-file "$env_file" \
    "$image_name" || {
      echo "Warning: Failed to start container $container_name"
      return 1
    }

  echo "Container $container_name started on port $port (localhost only)"
  docker ps --filter "name=$container_name" --format "{{.Names}}: {{.Status}}"
}

# Deploy all 5 users containers
deploy_container "users-create" "${docker_image_users_create}" 3001 || true
deploy_container "users-delete" "${docker_image_users_delete}" 3002 || true
deploy_container "users-list" "${docker_image_users_list}" 3003 || true
deploy_container "users-search" "${docker_image_users_search}" 3004 || true
deploy_container "users-update" "${docker_image_users_update}" 3005 || true

# Wait a few seconds for containers to be ready
echo "Waiting for containers to initialize..."
sleep 10

# Verify containers are running
echo "Container status:"
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

# Cleanup unused images
docker image prune -a -f || true

echo "=== User Data Script Completed ==="
echo "Timestamp: $(date)"
echo ""
echo "Summary:"
echo ""
echo "Final container status:"
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
