# Project 4 - Microservices Architecture

## Table of Contents
- [Introduction](#introduction)
- [Architecture](#architecture)
- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [Installation and Setup](#installation-and-setup)
- [Running the Project](#running-the-project)
- [API Endpoints](#api-endpoints)
- [Monitoring & Analytics](#monitoring--analytics)
- [Security Considerations](#security-considerations)
- [Contributing](#contributing)


---

## Introduction
Project 4 is a microservices-based application designed to showcase authentication, API gateway handling, monitoring, and analytics. It follows a distributed architecture to enhance scalability and maintainability.

## Architecture
The project consists of several microservices that communicate via APIs. Below is a high-level overview of the architecture:
- **API Gateway:** Routes requests to the appropriate microservices.
- **Authentication Services:** Handles user authentication and token management.
- **Analytics Service:** Collects and processes usage data.
- **Monitoring Service:** Tracks system health and performance.

## Technologies Used
- **Programming Languages:** Node.js, Python
- **Frameworks:** Express.js, Flask
- **Databases:** PostgreSQL, MongoDB
- **Authentication:** JWT, OAuth2
- **API Gateway:** Kong, Nginx
- **Monitoring:** Prometheus, Grafana
- **Containerization:** Docker, Kubernetes
- **Messaging System:** Kafka, RabbitMQ

## Project Structure
```
Project-4/
│── analytics/            # Analytics service
│── api-gateway/         # API Gateway for routing
│── auth-contract/       # Authentication contract files
│── auth-service-1/      # Authentication microservice 1
│── auth-service-2/      # Authentication microservice 2
│── monitoring/          # Monitoring and logging service
│── docker-compose.yml   # Docker Compose configuration
│── README.md            # Project documentation
```

## Installation and Setup
1. **Clone the repository:**
   ```sh
   git clone https://github.com/slimaninasreddine/Project-4.git
   cd Project-4
   ```

2. **Set up environment variables:**
   - Create a `.env` file in the root directory.
   - Define required configurations such as database URLs, authentication secrets, etc.

3. **Start services with Docker:**
   ```sh
   docker-compose up --build
   ```
   This will build and start all microservices as containers.

4. **Manual Setup (Without Docker)**
   - Install dependencies for each service:
     ```sh
     cd auth-service-1 && npm install
     cd ../auth-service-2 && npm install
     ```
   - Start services manually:
     ```sh
     node server.js
     ```

## Running the Project
- Access the API gateway: `http://localhost:8000`
- Authentication service: `http://localhost:5001`
- Monitoring dashboard (Grafana): `http://localhost:3000`

## API Endpoints
| Service          | Endpoint                   | Method | Description               |
|-----------------|---------------------------|--------|---------------------------|
| API Gateway     | `/api/*`                   | GET    | Routes to microservices   |
| Auth Service 1  | `/auth/login`              | POST   | User authentication       |
| Auth Service 2  | `/auth/register`           | POST   | User registration         |
| Analytics       | `/analytics/events`        | GET    | Fetch analytics data      |
| Monitoring      | `/monitoring/health`       | GET    | Check service health      |

## Monitoring & Analytics
- **Prometheus** is used for collecting metrics.
- **Grafana** provides a dashboard for visualization.
- **Logging** is handled using a centralized logging system.

## Security Considerations
- **Use Environment Variables:** Avoid hardcoding secrets.
- **Authentication Tokens:** JWT is used for secure API authentication.
- **Rate Limiting:** Implemented at the API gateway level to prevent abuse.

## Contributing
We welcome contributions! To contribute:
1. Fork the repository.
2. Create a new branch: `git checkout -b feature-branch`
3. Commit your changes: `git commit -m "Add new feature"`
4. Push to your branch: `git push origin feature-branch`
5. Open a Pull Request.


