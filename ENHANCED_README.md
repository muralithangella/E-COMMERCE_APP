# Amazon-Style E-Commerce Application

A modern, scalable e-commerce application built with microservices architecture, designed to match Amazon's UI/UX with complete shopping cart functionality and order management.

## 🎆 Features

✅ **Complete E-Commerce Flow** - Product browsing → Cart → Checkout → Order confirmation  
✅ **Amazon-Style Design** - Pixel-perfect Amazon.in UI/UX  
✅ **Redux State Management** - Persistent cart with localStorage  
✅ **Service Layer Architecture** - Scalable service-based design  
✅ **API Integration** - Full backend integration with error handling  
✅ **Responsive Design** - Works on all devices  
✅ **Performance Optimized** - Lazy loading, memoization, compression  
✅ **Security** - Helmet, CORS, Rate limiting, input validation  
✅ **Error Handling** - Comprehensive error management  
✅ **TypeScript Ready** - Structured for easy TS migration

## 🏢 Architecture

```
├── backend/
│   └── server.js              # Express API server with full endpoints
├── frontend/shell/
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── pages/             # Route components
│   │   ├── services/          # API service layer
│   │   ├── store/             # Redux store & slices
│   │   ├── hooks/             # Custom React hooks
│   │   ├── utils/             # Utilities & constants
│   │   └── styles/            # Global styles
│   └── package.json
└── README.md
```

### 🛠️ Service Layer
- **ProductService** - Product data management
- **CartService** - Cart operations & API sync
- **OrderService** - Order processing & management
- **ErrorHandler** - Centralized error handling

## 🚀 API Endpoints

### Products
- `GET /api/products` - Get all products with filtering
- `GET /api/products/:id` - Get single product
- `GET /api/deals` - Get today's deals
- `GET /api/recommendations` - Get recommended products
- `GET /api/search/suggestions` - Search products

### Categories
- `GET /api/categories` - Get all categories

### Cart Management
- `GET /api/cart` - Get cart items
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/items/:id` - Update cart item quantity
- `DELETE /api/cart/items/:id` - Remove cart item
- `DELETE /api/cart/clear` - Clear entire cart

### Order Management
- `POST /api/orders` - Create new order
- `GET /api/orders` - Get all orders
- `GET /api/orders/:id` - Get specific order

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout

## 🎨 Amazon-Style Features

### UI Components
- **Header**: Amazon-style navigation with search, location, account menu, cart count
- **Navigation Bar**: Category navigation identical to Amazon
- **Hero Banner**: Promotional banners with call-to-action
- **Product Cards**: Amazon-style cards with ratings, pricing, discounts
- **Shopping Cart**: Full cart management with quantity controls
- **Checkout Flow**: Multi-step checkout (Address → Payment → Review)
- **Order Confirmation**: Complete order details with tracking

### Design System
- **Colors**: Amazon's exact color palette (#131921, #ff9f00, #232f3e)
- **Typography**: Amazon Ember font family
- **Spacing**: Amazon's 8px grid system
- **Components**: Pixel-perfect Amazon component replicas

## 🚀 Production Deployment

### Environment Variables
```bash
# Backend
NODE_ENV=production
PORT=5000
DB_CONNECTION_STRING=your_db_url
JWT_SECRET=your_jwt_secret

# Frontend
REACT_APP_API_URL=https://your-api-domain.com
REACT_APP_ENVIRONMENT=production
```

### Build & Deploy
```bash
# Install dependencies
npm run install:all

# Build for production
npm run build

# Start production server
npm start
```

## 🔒 Security Features

- **Helmet.js** - Security headers protection
- **CORS** - Cross-origin request protection  
- **Rate Limiting** - 100 requests per 15 minutes
- **Input Validation** - Server-side validation
- **Error Handling** - Secure error responses
- **JWT Authentication** - Secure user sessions
- **XSS Protection** - Content Security Policy

## ⚡ Performance Features

- **Gzip Compression** - Reduced bundle sizes
- **React.memo** - Component memoization
- **useCallback/useMemo** - Hook optimization
- **Code Splitting** - Lazy loading routes
- **Redux Toolkit** - Efficient state management
- **Service Workers** - Offline functionality
- **Image Optimization** - WebP format support

## 📊 Scalability Features

- **Service Layer** - Separation of concerns
- **Custom Hooks** - Reusable business logic
- **Error Boundaries** - Graceful error handling
- **Constants Management** - Centralized configuration
- **API Abstraction** - Easy backend switching
- **Modular Architecture** - Easy feature addition

## 📝 Development Guidelines

### Code Structure
- **Components**: Functional components with hooks
- **Services**: API calls and business logic
- **Utils**: Pure utility functions
- **Constants**: Configuration and enums
- **Hooks**: Custom reusable hooks

### Best Practices
- Use TypeScript for type safety (migration ready)
- Follow React best practices (hooks, memo, etc.)
- Implement proper error handling
- Write unit tests for critical functions
- Use semantic commit messages
- Follow ESLint and Prettier rules

## 🔧 Troubleshooting

### Common Issues
1. **Cart not persisting**: Check localStorage permissions
2. **API errors**: Verify backend server is running on port 5000
3. **Build failures**: Clear node_modules and reinstall
4. **CORS errors**: Check backend CORS configuration

## 🕰️ Roadmap

- [ ] TypeScript migration
- [ ] Unit test coverage
- [ ] PWA implementation
- [ ] Real payment integration
- [ ] Admin dashboard
- [ ] Analytics integration
- [ ] Multi-language support
- [ ] Dark mode theme