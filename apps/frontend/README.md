# GradFlow - Microservices Architecture

## Project Overview
GradFlow is a full-stack application built with a microservices architecture, featuring a React frontend and multiple TypeScript/Python backend services orchestrated with Docker.

## Backend Services

### 1. API Gateway
- **Stack**: TypeScript, Express
- **Functionality**:
  - Central routing for all microservices
  - Authentication middleware (JWT verification)
  - Request logging
- **Structure**:
  - `src/middlewares/`: Auth and logging handlers
  - `src/routes/`: Route definitions for all services

### 2. Authentication Service
- **Components**:
  - **Login**: User authentication with JWT issuance
  - **Me**: Session management
  - **Roles**: Role-based access control
- **Common Features**:
  - Swagger documentation
  - PostgreSQL integration
  - Docker containers

### 3. File Service (Python)
- **Operations**:
  - File upload/download
  - Metadata management
  - File system initialization
- **Key Modules**:
  - Abstract filesystem layer (`filesystem.py`)
  - Individual Docker setups per operation

### 4. User Management
- **Microservices**:
  - User Creation: Registration with validation
  - User Search: Filtered queries
  - User Update: Password/account modifications
  - User Deletion: Soft/hard delete options
  - User Listing: Paginated results
- **Security**:
  - Role-based guards
  - Auth middleware on all endpoints

## Frontend Application
- **Stack**: React + TypeScript + Vite
- **Key Features**:
  - CRUD operations via API
  - Modal-based forms
  - Axios API client
- **Structure**:
  - `src/api/`: API connection handlers
  - `src/components/`: Reusable UI components
  - Dockerized deployment

## Architecture Highlights
1. **Microservices Design**:
   - Independent services with dedicated databases
   - API Gateway for centralized routing
   - Docker Compose orchestration

2. **Security**:
   - JWT authentication
   - Role-based access control
   - Protected endpoints

3. **Development**:
   - Swagger documentation
   - TypeScript strict typing
   - ESLint/Prettier configurations

## Docker Setup
All services include Docker configurations for:
- Local development
- CI/CD pipelines
- Scalable deployments

```bash
# Start all services
docker-compose up --build
```

## Development Notes
1. Environment variables required for:
   - Database connections
   - JWT secret keys
   - API endpoints
2. Testing:
   - Postman collection available
   - Swagger UI at `/api-docs`
