# API Gateway

Central gateway for all GradFlow microservices.

## Features

- Centralized routing for all services
- Health check endpoints for all services
- Service communication logging
- Request/response logging
- Error handling and retry logic

## Services Integrated

### Auth Services
- Login: `http://localhost:3006`
- Roles: `http://localhost:3007`
- Me: `http://localhost:3008`

### User Services
- Create: `http://localhost:3001`
- Delete: `http://localhost:3002`
- List: `http://localhost:3003`
- Search: `http://localhost:3004`
- Update: `http://localhost:3005`

### File Services
- Init: `http://localhost:3011`
- Update: `http://localhost:3012`
- Upload: `http://localhost:3013`
- List: `http://localhost:3014`
- Download: `http://localhost:3015`

## API Endpoints

### Health Check
```
GET /api/health
GET /api/health/:serviceName
```

### Service Logs
```
GET /api/logs
GET /api/logs?service=files
GET /api/logs/:service
DELETE /api/logs (clear logs)
```

### File Service Routes
```
POST /api/files/init-student
PUT /api/files/update-student-folder
POST /api/files/upload
GET /api/files/list
GET /api/files/download
```

## Environment Variables

Create a `.env` file:

```env
PORT=3000

# File Service URLs
FILE_SERVICE_INIT_URL=http://localhost:3011
FILE_SERVICE_UPDATE_URL=http://localhost:3012
FILE_SERVICE_UPLOAD_URL=http://localhost:3013
FILE_SERVICE_LIST_URL=http://localhost:3014
FILE_SERVICE_DOWNLOAD_URL=http://localhost:3015

# Users Service URLs
USERS_CREATE_URL=http://localhost:3001
USERS_DELETE_URL=http://localhost:3002
USERS_LIST_URL=http://localhost:3003
USERS_SEARCH_URL=http://localhost:3004
USERS_UPDATE_URL=http://localhost:3005

# Auth Service URLs
AUTH_LOGIN_URL=http://localhost:3006
AUTH_ROL_URL=http://localhost:3007
AUTH_ME_URL=http://localhost:3008
```

## Running

```bash
# Development
npm run dev

# Production
npm run build
npm start
```

## Testing Service Communication

1. Start API Gateway: `npm run dev`
2. Check health: `GET http://localhost:3000/api/health`
3. View logs: `GET http://localhost:3000/api/logs`
4. Create a user and check logs to see file-service communication

## Logging

All service calls are logged with:
- Timestamp
- Service name
- Endpoint
- Status (success/error)
- Request/response data
- Response time

Logs are kept in memory (last 1000 entries) and can be accessed via `/api/logs`.
