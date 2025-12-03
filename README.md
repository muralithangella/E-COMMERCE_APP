# E-Commerce Microservices & Micro-Frontend Architecture

## Architecture Overview

### Backend - Microservices Architecture
- **API Gateway** (Port 5000) - Routes requests to appropriate microservices
- **Auth Service** (Port 3001) - User authentication and authorization
- **Products Service** (Port 3002) - Product catalog management
- **Orders Service** (Port 3003) - Order processing and management
- **Payments Service** (Port 3004) - Payment processing integration
- **Inventory Service** (Port 3005) - Stock management and tracking
- **Notifications Service** (Port 3006) - Email/SMS notifications
- **Users Service** (Port 3007) - User profile management

### Frontend - Micro-Frontend Architecture
- **Shell Application** (Port 3000) - Main container and routing
- **Auth Micro-Frontend** (Port 3001) - Login/Register components
- **Products Micro-Frontend** (Port 3002) - Product listing and details
- **Cart Micro-Frontend** (Port 3003) - Shopping cart functionality
- **Checkout Micro-Frontend** (Port 3004) - Checkout process
- **Profile Micro-Frontend** (Port 3005) - User profile management

### Database Architecture
- **MongoDB** - Primary database with replica sets and sharding
  - Products DB - Product catalog data
  - Orders DB - Order and transaction data
  - Users DB - User profiles and authentication
- **Redis** - Caching and session management
- **Oracle** - Legacy system integration (optional)

### Message Queue
- **Apache Kafka** - Event-driven communication between services

## Project Structure

```
ecommerce-app/
├── backend/
│   ├── gateway.js                 # API Gateway
│   ├── config/
│   │   ├── database.js           # Database connections
│   │   └── kafka.js              # Kafka configuration
│   ├── src/
│   │   ├── auth/                 # Authentication Service
│   │   │   ├── server.js
│   │   │   ├── controllers/
│   │   │   ├── models/
│   │   │   └── routes/
│   │   ├── products/             # Products Service
│   │   ├── orders/               # Orders Service
│   │   ├── payments/             # Payments Service
│   │   ├── inventory/            # Inventory Service
│   │   ├── notifications/        # Notifications Service
│   │   └── users/                # Users Service
│   ├── middleware/               # Shared middleware
│   ├── utils/                    # Shared utilities
│   └── docker-compose.yml        # Container orchestration
├── frontend/
│   ├── shell/                    # Main Shell Application
│   │   ├── src/
│   │   ├── webpack.config.js     # Module Federation config
│   │   └── package.json
│   ├── auth-mf/                  # Auth Micro-Frontend
│   ├── products-mf/              # Products Micro-Frontend
│   ├── cart-mf/                  # Cart Micro-Frontend
│   ├── checkout-mf/              # Checkout Micro-Frontend
│   ├── profile-mf/               # Profile Micro-Frontend
│   └── shared/                   # Shared components and services
└── shared/                       # Shared types and utilities
    ├── types/
    ├── utils/
    └── constants/
```

## Getting Started

### Prerequisites
- Node.js 18+
- Docker & Docker Compose
- MongoDB
- Redis
- Apache Kafka

### Backend Setup

1. **Start Infrastructure Services**
```bash
cd backend
docker-compose up -d mongodb redis kafka zookeeper
```

2. **Install Dependencies**
```bash
npm install
```

3. **Start Microservices**
```bash
# Start all services
npm run start:all

# Or start individual services
npm run start:auth
npm run start:products
npm run start:orders
# etc.
```

### Frontend Setup

1. **Install Shell Application**
```bash
cd frontend/shell
npm install
npm start
```

2. **Start Micro-Frontends**
```bash
# In separate terminals
cd frontend/auth-mf && npm install && npm start
cd frontend/products-mf && npm install && npm start
cd frontend/cart-mf && npm install && npm start
cd frontend/checkout-mf && npm install && npm start
cd frontend/profile-mf && npm install && npm start
```

## Key Features

### Backend Features
- **Microservices Architecture** - Independent, scalable services
- **API Gateway** - Centralized routing and load balancing
- **Event-Driven Communication** - Kafka for async messaging
- **Database Sharding** - Horizontal scaling with MongoDB
- **Caching Layer** - Redis for performance optimization
- **Authentication & Authorization** - JWT-based security
- **Rate Limiting** - Protection against abuse
- **Health Monitoring** - Service health checks

### Frontend Features
- **Micro-Frontend Architecture** - Independent deployable frontends
- **Module Federation** - Runtime code sharing
- **Shared State Management** - Redux for cross-MF communication
- **Component Library** - Reusable UI components
- **Lazy Loading** - Performance optimization
- **Error Boundaries** - Graceful error handling

## Development Guidelines

### Backend
- Each microservice is independently deployable
- Use event-driven communication for loose coupling
- Implement circuit breakers for resilience
- Follow RESTful API design principles
- Use proper error handling and logging

### Frontend
- Each micro-frontend owns its domain
- Share common dependencies through Module Federation
- Use shared state for cross-MF communication
- Implement proper error boundaries
- Follow consistent UI/UX patterns

## Deployment

### Docker Deployment
```bash
docker-compose up --build
```

### Kubernetes Deployment
```bash
kubectl apply -f k8s/
```

## Monitoring & Observability
- Health check endpoints for all services
- Centralized logging with structured logs
- Metrics collection and monitoring
- Distributed tracing for request flows

## Security
- JWT-based authentication
- Role-based access control
- Input validation and sanitization
- Rate limiting and DDoS protection
- HTTPS enforcement
- Security headers with Helmet.js