# Amazon-Style E-Commerce Application

A modern, scalable e-commerce application built with microservices architecture, designed to match Amazon's UI/UX.

## Features

✅ **Amazon-Style Design** - Matches Amazon.in's layout and styling  
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

2. **Start all services** (recommended)
```bash
npm run start:all
```

Or start services individually:

2a. **Start backend**
```bash
npm start
```

2b. **Start frontend services** (in separate terminals)
```bash
npm run start:shell
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
│   ├── shell/             # Main shell application (Amazon-style)
│   ├── products-mf/       # Products micro-frontend
│   ├── cart-mf/           # Cart micro-frontend
│   └── auth-mf/           # Authentication micro-frontend
└── package.json           # Root dependencies
```

## Amazon-Style Features

- **Header**: Amazon-style navigation with search bar, location, account menu
- **Navigation Bar**: Category navigation similar to Amazon
- **Hero Banner**: Rotating promotional banners with smooth transitions
- **Product Cards**: Enhanced product cards with category-based color coding and icons
- **Category Grid**: Interactive category tiles with emoji icons and hover effects
- **Product Images**: Smart placeholder system with category-specific colors and icons
- **Cart**: Amazon-style shopping cart with quantity controls
- **Footer**: Complete Amazon-style footer with links
- **Color Scheme**: Matches Amazon's brand colors (#131921, #ff9f00, etc.)
- **Responsive Design**: Mobile-first approach with adaptive layouts
- **Loading States**: Smooth loading animations and skeleton screens
- **Error Handling**: Graceful error handling with user-friendly messages

## Access Points

- **Main Application**: http://localhost:3000 (Shell)
- **Products Service**: http://localhost:3001
- **Cart Service**: http://localhost:3002
- **Auth Service**: http://localhost:3003
- **Backend API**: http://localhost:5000

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