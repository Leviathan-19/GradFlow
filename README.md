# GradFlow - Microservices Architecture Platform

![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)
![Python](https://img.shields.io/badge/Python-3776AB?logo=python&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=white)

## 🌟 Project Overview
GradFlow is a full-stack application built with a microservices architecture, featuring:
- **React + TypeScript** frontend
- **Node.js/TypeScript** backend services
- **Python** file management service
- **Docker** container orchestration
- **JWT-based** authentication system

## 🚀 Features
### Backend Services
| Service          | Technology    | Functionality                          |
|------------------|--------------|----------------------------------------|
| API Gateway      | TypeScript   | Central routing, authentication        |
| Auth Service     | TypeScript   | JWT authentication, role management    |
| File Service     | Python       | File upload/download, metadata management |
| User Service     | TypeScript   | CRUD operations, search functionality  |

### Frontend Application
- User management dashboard
- File upload/download interface
- Responsive design
- API integration via Axios

## 🛠 Technologies
- **Frontend**: React 18, TypeScript, Vite, Axios
- **Backend**: Node.js, Express, TypeScript, Python 3.11
- **Database**: PostgreSQL (Users), File System (Files)
- **Infrastructure**: Docker, Docker Compose
- **Authentication**: JWT, RBAC (Role-Based Access Control)

## ⚙️ Installation
```bash
# Clone repository
git clone https://github.com/yourusername/gradflow.git
cd gradflow

# Install dependencies
npm install
```

## 🔧 Configuration
Create `.env` files with these required variables:
```env
# API Gateway
JWT_SECRET=your_jwt_secret_key
DATABASE_URL=postgres://user:password@host:port/dbname

# File Service
FILE_STORAGE_PATH=./file-storage
MAX_FILE_SIZE=10485760  # 10MB
```

## 🏃 Running the Application
```bash
# Start all services with Docker
docker-compose up --build

# Access services:
- Frontend: http://localhost:3000
- API Gateway: http://localhost:8000
- Swagger Docs: http://localhost:8000/api-docs
```

## 📚 API Documentation
All backend services include Swagger documentation available at:
`/api-docs` endpoint for each service

## 🤝 Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License
This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

---

**Diagrama de Arquitectura**  
![Microservices Architecture](https://via.placeholder.com/800x400.png?text=Architecture+Diagram)