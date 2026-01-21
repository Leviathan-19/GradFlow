# Local Testing Guide for File Service

## Overview

The file service is designed to work on Ubuntu EC2 instances, but it can also be tested locally on Windows. The configuration automatically detects the operating system and uses appropriate paths.

## Configuration

The `config.py` file automatically detects the OS:
- **Windows (Local)**: Uses `gradflow_data` folder in the project directory
- **Linux (EC2)**: Uses `/gradflow` at the root

You can override this by setting the `FILE_BASE_PATH` environment variable.

## Running Services Locally

### Option 1: Run Individual Services

Each microservice can be run independently:

```bash
# Terminal 1 - Init Service
cd files_init
python -m uvicorn main:app --host 0.0.0.0 --port 3011

# Terminal 2 - Update Service
cd files_update
python -m uvicorn main:app --host 0.0.0.0 --port 3012

# Terminal 3 - Upload Service
cd files_upload
python -m uvicorn main:app --host 0.0.0.0 --port 3013

# Terminal 4 - List Service
cd files_list
python -m uvicorn main:app --host 0.0.0.0 --port 3014

# Terminal 5 - Download Service
cd files_download
python -m uvicorn main:app --host 0.0.0.0 --port 3015
```

### Option 2: Use Docker Compose

```bash
cd file-service
docker-compose up
```

This will start all services at once.

## Testing User Creation Flow

1. **Start all services**:
   - API Gateway: `http://localhost:3000`
   - Users Create: `http://localhost:3001`
   - File Service Init: `http://localhost:3011`

2. **Create a student user** via API Gateway:
```bash
POST http://localhost:3000/api/users
{
  "name1": "John",
  "name2": "Carlos",
  "lastname1": "Doe",
  "lastname2": "Smith",
  "email": "john.doe@example.com",
  "password": "password123",
  "degree": "Computer Science",
  "telephone_number": "1234567890",
  "rol_id": "d70f1978-c472-4cba-a70f-432337f19e9f"
}
```

3. **Check logs**:
   - API Gateway logs: `http://localhost:3000/api/logs`
   - Check if folder was created in `gradflow_data/students/` directory

4. **Verify folder structure**:
   - On Windows: Check `GradFlow/apps/backend/file-service/gradflow_data/students/`
   - Should see: `Doe_Smith_John_Carlos/` with subfolders `seccion1`, `seccion2`, `seccion3`, `seccion4`

## Health Checks

Check service health via API Gateway:

```bash
# Check all services
GET http://localhost:3000/api/health

# Check specific service
GET http://localhost:3000/api/health/files_init
```

## Service Logs

View service communication logs:

```bash
# All logs
GET http://localhost:3000/api/logs

# Logs for specific service
GET http://localhost:3000/api/logs?service=files

# Limited logs
GET http://localhost:3000/api/logs?limit=50
```

## Environment Variables

Create a `.env` file in the API Gateway directory:

```env
# API Gateway
PORT=3000

# File Service URLs (if running locally)
FILE_SERVICE_INIT_URL=http://localhost:3011
FILE_SERVICE_UPDATE_URL=http://localhost:3012
FILE_SERVICE_UPLOAD_URL=http://localhost:3013
FILE_SERVICE_LIST_URL=http://localhost:3014
FILE_SERVICE_DOWNLOAD_URL=http://localhost:3015

# Users Service URLs
USERS_CREATE_URL=http://localhost:3001
USERS_UPDATE_URL=http://localhost:3005

# API Gateway URL (for users_create and users_update)
API_GATEWAY_URL=http://localhost:3000
```

## Troubleshooting

### Folder not created on Windows
- Check if `gradflow_data` folder exists in `file-service` directory
- Verify Python has write permissions
- Check logs: `http://localhost:3000/api/logs?service=files`

### Service connection failed
- Verify all services are running on correct ports
- Check health endpoint: `http://localhost:3000/api/health`
- Review API Gateway logs for connection errors

### Port already in use
- Change port in service's `main.py` file
- Update corresponding URL in API Gateway `.env`

## Testing Complete Flow

1. Start API Gateway
2. Start Users Create service
3. Start File Service Init service
4. Create a student user via API Gateway
5. Check health endpoint to verify all services
6. Check logs to see communication flow
7. Verify folder structure was created
