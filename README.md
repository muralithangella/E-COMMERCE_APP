# Clean E-Commerce Application

A modern, scalable e-commerce application built with microservices architecture.

## Features

✅ **Clean Architecture** - Minimal, maintainable code  
✅ **Security** - Helmet, CORS, Rate limiting  
✅ **Performance** - Compression, optimized React components  
✅ **Scalable** - Microservices ready  
✅ **Robust** - Error handling, loading states  

## Quick Start

1. **Install dependencies**
```bash
npm run install:all
```

2. **Start backend**
```bash
npm start
```

3. **Start frontend services** (in separate terminals)
```bash
npm run start:products
npm run start:cart
```

## API Endpoints

- `GET /api/products` - Get all products
- `GET /api/categories` - Get categories
- `GET /api/cart` - Get cart items
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/items/:id` - Update cart item
- `DELETE /api/cart/items/:id` - Remove cart item
- `DELETE /api/cart/clear` - Clear cart

## Architecture

```
├── backend/
│   └── server.js          # Clean API server
├── frontend/
│   ├── products-mf/       # Products micro-frontend
│   └── cart-mf/           # Cart micro-frontend
└── package.json           # Root dependencies
```

## Production Deployment

1. Set environment variables:
   - `NODE_ENV=production`
   - `PORT=5000`
   - `REACT_APP_API_URL=https://your-api-domain.com`

2. Build and deploy:
```bash
npm run build
npm start
```

## Security Features

- Helmet.js for security headers
- CORS protection
- Rate limiting (100 requests/15min)
- Input validation
- Error handling

## Performance Features

- Gzip compression
- React.memo optimization
- useCallback hooks
- Minimal re-renders
- Efficient state management