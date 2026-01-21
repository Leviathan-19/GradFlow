#!/bin/bash
# Script to generate .env file from Terraform outputs
# Usage: ./generate-env-from-terraform.sh <terraform_directory> <service_name>

TERRAFORM_DIR=$1
SERVICE_NAME=$2

if [ -z "$TERRAFORM_DIR" ] || [ -z "$SERVICE_NAME" ]; then
  echo "Usage: $0 <terraform_directory> <service_name>"
  exit 1
fi

cd "$TERRAFORM_DIR" || exit 1

# Get Terraform outputs
LOAD_BALANCER_DNS=$(terraform output -raw loadbalancer_dns 2>/dev/null || echo "")
DB_HOST=$(terraform output -raw db_host 2>/dev/null || echo "${DB_HOST:-localhost}")
DB_USER=$(terraform output -raw db_user 2>/dev/null || echo "${DB_USER:-postgres}")
DB_PASSWORD=$(terraform output -raw db_password 2>/dev/null || echo "${DB_PASSWORD}")
DB_NAME=$(terraform output -raw db_name 2>/dev/null || echo "${DB_NAME:-gradflow}")
DB_PORT=$(terraform output -raw db_port 2>/dev/null || echo "${DB_PORT:-5432}")

# Service ports mapping
case $SERVICE_NAME in
  "users_create")
    PORT=3001
    ;;
  "users_delete")
    PORT=3002
    ;;
  "users_list")
    PORT=3003
    ;;
  "users_search")
    PORT=3004
    ;;
  "users_update")
    PORT=3005
    ;;
  "auth_login")
    PORT=3006
    ;;
  "auth_rol")
    PORT=3007
    ;;
  "auth_me")
    PORT=3008
    ;;
  "api_gateway")
    PORT=3000
    ;;
  "files_init")
    PORT=3011
    ;;
  "files_update")
    PORT=3012
    ;;
  "files_upload")
    PORT=3013
    ;;
  "files_list")
    PORT=3014
    ;;
  "files_download")
    PORT=3015
    ;;
  *)
    PORT=3000
    ;;
esac

# Generate .env file
cat > .env <<EOF
# Database Configuration
DB_HOST=${DB_HOST}
DB_USER=${DB_USER}
DB_PASSWORD=${DB_PASSWORD}
DB_NAME=${DB_NAME}
DB_PORT=${DB_PORT}

# Service Configuration
PORT=${PORT}
NODE_ENV=production

# API Gateway URL (use Load Balancer DNS)
API_GATEWAY_URL=http://${LOAD_BALANCER_DNS:-localhost:3000}

# Service URLs (use Load Balancer DNS for internal communication)
USERS_CREATE_URL=http://${LOAD_BALANCER_DNS:-localhost:3001}
USERS_DELETE_URL=http://${LOAD_BALANCER_DNS:-localhost:3002}
USERS_LIST_URL=http://${LOAD_BALANCER_DNS:-localhost:3003}
USERS_SEARCH_URL=http://${LOAD_BALANCER_DNS:-localhost:3004}
USERS_UPDATE_URL=http://${LOAD_BALANCER_DNS:-localhost:3005}
AUTH_LOGIN_URL=http://${LOAD_BALANCER_DNS:-localhost:3006}
AUTH_ROL_URL=http://${LOAD_BALANCER_DNS:-localhost:3007}
AUTH_ME_URL=http://${LOAD_BALANCER_DNS:-localhost:3008}
FILE_SERVICE_INIT_URL=http://${LOAD_BALANCER_DNS:-localhost:3011}
FILE_SERVICE_UPDATE_URL=http://${LOAD_BALANCER_DNS:-localhost:3012}
FILE_SERVICE_UPLOAD_URL=http://${LOAD_BALANCER_DNS:-localhost:3013}
FILE_SERVICE_LIST_URL=http://${LOAD_BALANCER_DNS:-localhost:3014}
FILE_SERVICE_DOWNLOAD_URL=http://${LOAD_BALANCER_DNS:-localhost:3015}

# JWT Configuration
JWT_SECRET=${JWT_SECRET:-your-secret-key-change-in-production}
JWT_EXPIRES_IN=24h

# Docker Registry (if needed)
DOCKER_REGISTRY=${DOCKER_REGISTRY:-}
DOCKER_REGISTRY_USERNAME=${DOCKER_REGISTRY_USERNAME:-}
DOCKER_REGISTRY_PASSWORD=${DOCKER_REGISTRY_PASSWORD:-}
EOF

echo "Generated .env file for $SERVICE_NAME"
echo "Load Balancer DNS: ${LOAD_BALANCER_DNS:-not set}"
