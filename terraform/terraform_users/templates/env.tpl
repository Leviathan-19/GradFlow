# Database Configuration
DB_HOST=${db_host}
DB_USER=${db_user}
DB_PASSWORD=${db_password}
DB_NAME=${db_name}
DB_PORT=${db_port}

# Service Configuration
PORT=${port}
NODE_ENV=production

# API Gateway URL (use Load Balancer DNS)
API_GATEWAY_URL=http://${loadbalancer_dns}

# Service URLs (use Load Balancer DNS for internal communication)
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
