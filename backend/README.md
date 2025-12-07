# E-Commerce Backend - Modular Architecture

A scalable, maintainable backend built with **Node.js**, **Express**, and **MongoDB** following a **domain-driven modular architecture**.

## 🎯 Architecture Overview

This backend is structured into **self-contained modules**, each representing a business domain (Product, Cart, Order, Auth, User). This design makes the codebase:

- ✅ **Scalable** - Easy to extract modules into microservices
- ✅ **Maintainable** - Clear organization, easy to navigate
- ✅ **Testable** - Isolated modules for unit testing
- ✅ **Team-Friendly** - Multiple teams can work independently
- ✅ **Reusable** - Modules can be reused across projects

## 📁 Project Structure

```
backend/
├── src/
│   ├── modules/              # 🎯 Domain modules
│   │   ├── product/          # Product management
│   │   ├── cart/             # Shopping cart
│   │   ├── order/            # Order processing
│   │   ├── auth/             # Authentication
│   │   ├── user/             # User management
│   │   ├── payment/          # Payment processing (ready)
│   │   ├── inventory/        # Inventory management (ready)
│   │   ├── notification/     # Notifications (ready)
│   │   └── category/         # Categories (ready)
│   │
│   ├── config/               # Configuration files
│   ├── middleware/           # Shared middleware
│   ├── utils/                # Shared utilities
│   ├── workers/              # Background workers
│   └── app.js                # Application entry point
│
├── .env                      # Environment variables
├── package.json              # Dependencies
└── Documentation files       # See below
```

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Create `.env` file:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret
NODE_ENV=development
```

### 3. Start Server
```bash
# Production
npm start

# Development (with nodemon)
npm run dev
```

### 4. Verify
```bash
curl http://localhost:5000/health
```

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [STRUCTURE_DIAGRAM.md](./STRUCTURE_DIAGRAM.md) | Complete visual architecture diagram |
| [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md) | How we migrated to modular structure |
| [RESTRUCTURE_SUMMARY.md](./RESTRUCTURE_SUMMARY.md) | Summary of restructuring work |
| [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) | Quick reference for developers |
| [src/modules/README.md](./src/modules/README.md) | Module architecture details |

## 🎨 Module Pattern

Each module follows this consistent pattern:

```
module-name/
├── models/          # Mongoose schemas
├── controllers/     # Request handlers
├── services/        # Business logic
├── routes/          # API endpoints
├── utils/           # Module utilities
└── index.js         # Module exports
```

### Example: Product Module

```javascript
// Import entire module
const productModule = require('./modules/product');

// Or import specific components
const Product = require('./modules/product/models/Product');
const productService = require('./modules/product/services/productService');
const productController = require('./modules/product/controllers/productController');
```

## 🔌 API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `GET /api/products/featured` - Get featured products
- `GET /api/products/deals` - Get deals

### Cart (Auth Required)
- `GET /api/cart` - Get cart
- `POST /api/cart/add` - Add to cart
- `PUT /api/cart/items/:itemId` - Update cart item
- `DELETE /api/cart/items/:itemId` - Remove from cart
- `DELETE /api/cart/clear` - Clear cart

### Orders (Auth Required)
- `POST /api/orders` - Create order
- `GET /api/orders` - Get orders
- `GET /api/orders/:id` - Get order by ID
- `PUT /api/orders/:id/status` - Update order status
- `DELETE /api/orders/:id` - Cancel order

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/refresh-token` - Refresh token
- `POST /api/auth/forgot-password` - Forgot password
- `POST /api/auth/reset-password` - Reset password

### Users (Auth Required)
- `GET /api/users/profile` - Get user profile

## 🛠️ Technology Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: Helmet, CORS, Rate Limiting
- **Validation**: Express Validator, Joi
- **Logging**: Winston
- **Caching**: Redis (optional)
- **Message Queue**: RabbitMQ/Kafka (optional)

## 🔐 Security Features

- ✅ Helmet.js for security headers
- ✅ CORS protection
- ✅ Rate limiting (100 requests/15min)
- ✅ Input validation and sanitization
- ✅ Password hashing with bcrypt
- ✅ JWT token authentication
- ✅ XSS protection
- ✅ MongoDB injection prevention

## 📊 Available Modules

| Module | Status | Description |
|--------|--------|-------------|
| Product | ✅ Complete | Product management, search, filtering |
| Cart | ✅ Complete | Shopping cart operations |
| Order | ✅ Complete | Order creation and management |
| Auth | ✅ Complete | User authentication and authorization |
| User | ✅ Complete | User profile management |
| Payment | 📁 Ready | Payment processing (Stripe, PayPal) |
| Inventory | 📁 Ready | Stock management |
| Notification | 📁 Ready | Email/SMS notifications |
| Category | 📁 Ready | Product categories |

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

## 🔧 Development

### Adding a New Module

1. Create module structure:
```bash
mkdir -p src/modules/your-module/{models,controllers,services,routes,utils}
```

2. Create `index.js`:
```javascript
module.exports = {
  routes: require('./routes/yourRoutes'),
  controller: require('./controllers/yourController'),
  service: require('./services/yourService'),
  model: require('./models/YourModel')
};
```

3. Register routes in `src/app.js`:
```javascript
this.app.use('/api/your-module', require('./modules/your-module/routes/yourRoutes'));
```

### Code Style

- Use **camelCase** for variables and functions
- Use **PascalCase** for classes and models
- Use **async/await** for asynchronous operations
- Add **JSDoc comments** for functions
- Follow **ESLint** rules

```bash
# Check code style
npm run lint

# Fix code style issues
npm run lint:fix
```

## 🚀 Deployment

### Docker
```bash
docker-compose up -d
```

### Production Build
```bash
NODE_ENV=production npm start
```

### Environment Variables
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb://your-production-db
JWT_SECRET=your-production-secret
ALLOWED_ORIGINS=https://yourdomain.com
```

## 📈 Performance

- ✅ Gzip compression enabled
- ✅ Response caching with Redis
- ✅ Database query optimization
- ✅ Connection pooling
- ✅ Rate limiting
- ✅ Efficient indexing

## 🤝 Contributing

1. Follow the modular structure
2. Write tests for new features
3. Update documentation
4. Follow code style guidelines
5. Create meaningful commit messages

## 📝 Scripts

```bash
npm start          # Start production server
npm run dev        # Start development server
npm test           # Run tests
npm run lint       # Check code style
npm run lint:fix   # Fix code style issues
```

## 🐛 Troubleshooting

### Module Import Errors
```bash
# Test module imports
node -e "require('./src/modules/product')"
```

### Database Connection Issues
- Check MongoDB is running
- Verify `MONGODB_URI` in `.env`
- Check network connectivity

### Port Already in Use
```bash
# Change PORT in .env or kill process
lsof -ti:5000 | xargs kill -9  # Unix/Mac
netstat -ano | findstr :5000   # Windows
```

## 📞 Support

- Check documentation files in root directory
- Review `src/modules/README.md` for module details
- See `QUICK_REFERENCE.md` for common tasks

## 📄 License

MIT License - See LICENSE file for details

## 🎉 Acknowledgments

Architecture inspired by:
- Domain-Driven Design principles
- Microservices architecture patterns
- Clean Architecture by Robert C. Martin
- social-media-microservices project structure

---

**Built with ❤️ for scalability and maintainability**
