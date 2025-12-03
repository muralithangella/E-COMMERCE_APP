# E-commerce Frontend - Micro-Frontend Architecture

## Overview

This frontend is built using a micro-frontend architecture with Module Federation, designed to consume the E-commerce backend APIs. Each micro-frontend is independently deployable and manages its own domain.

## Architecture

### Micro-Frontends

1. **Shell Application** (Port 3000) - Main container and routing
2. **Auth Micro-Frontend** (Port 3001) - Authentication and user management
3. **Products Micro-Frontend** (Port 3002) - Product catalog and search
4. **Cart Micro-Frontend** (Port 3003) - Shopping cart functionality
5. **Checkout Micro-Frontend** (Port 3004) - Order processing and payment
6. **Profile Micro-Frontend** (Port 3005) - User profile and order history

### Shared Services

- **API Service** - Centralized API client with authentication
- **Common Components** - Reusable UI components
- **Utilities** - Shared helper functions

## Backend Integration

### API Endpoints Consumed

#### Authentication (`/api/auth`)
- `POST /register` - User registration
- `POST /login` - User login
- `POST /logout` - User logout
- `POST /refresh-token` - Token refresh
- `POST /forgot-password` - Password reset request
- `POST /reset-password` - Password reset

#### Products (`/api/products`)
- `GET /` - Get products with pagination and filters
- `GET /:id` - Get product details
- `POST /` - Create product (admin/vendor)
- `PUT /:id` - Update product (admin/vendor)
- `DELETE /:id` - Delete product (admin)

#### Categories (`/api/categories`)
- `GET /` - Get all categories
- `GET /:id` - Get category details
- `POST /` - Create category (admin)
- `PUT /:id` - Update category (admin)
- `DELETE /:id` - Delete category (admin)

#### Cart (`/api/cart`)
- `GET /` - Get user cart
- `POST /add` - Add item to cart
- `PUT /items/:itemId` - Update cart item quantity
- `DELETE /items/:itemId` - Remove item from cart
- `DELETE /clear` - Clear entire cart

#### Orders (`/api/orders`)
- `GET /` - Get user orders
- `GET /:id` - Get order details
- `POST /` - Create new order
- `PATCH /:id/status` - Update order status (admin)
- `PATCH /:id/cancel` - Cancel order

#### Users (`/api/users`)
- `GET /profile` - Get user profile
- `PUT /profile` - Update user profile
- `GET /addresses` - Get user addresses
- `POST /addresses` - Add new address
- `PUT /addresses/:id` - Update address
- `DELETE /addresses/:id` - Delete address

#### Reviews (`/api/reviews`)
- `GET /` - Get reviews (with product filter)
- `POST /` - Create review
- `PUT /:id` - Update review
- `DELETE /:id` - Delete review
- `POST /:id/helpful` - Mark review as helpful

## Data Models

### User Structure
```javascript
{
  _id: "string",
  email: "string",
  firstName: "string",
  lastName: "string",
  role: "customer|admin|vendor",
  profile: {
    avatar: "string",
    phone: "string",
    dateOfBirth: "date",
    gender: "male|female|other"
  },
  addresses: [{
    type: "home|work|other",
    street: "string",
    city: "string",
    state: "string",
    zipCode: "string",
    country: "string",
    isDefault: "boolean"
  }],
  preferences: {
    newsletter: "boolean",
    notifications: {
      email: "boolean",
      sms: "boolean"
    }
  }
}
```

### Product Structure
```javascript
{
  _id: "string",
  name: "string",
  slug: "string",
  description: "string",
  shortDescription: "string",
  sku: "string",
  price: {
    regular: "number",
    sale: "number"
  },
  category: "ObjectId",
  brand: "string",
  images: [{
    url: "string",
    alt: "string",
    isPrimary: "boolean"
  }],
  variants: [{
    name: "string",
    options: ["string"]
  }],
  inventory: {
    quantity: "number",
    lowStockThreshold: "number",
    trackQuantity: "boolean"
  },
  ratings: {
    average: "number",
    count: "number"
  },
  status: "draft|published|archived",
  featured: "boolean"
}
```

### Cart Structure
```javascript
{
  _id: "string",
  user: "ObjectId",
  items: [{
    _id: "string",
    product: "Product Object",
    quantity: "number",
    variant: {
      size: "string",
      color: "string"
    }
  }],
  totalItems: "number",
  totalPrice: "number"
}
```

### Order Structure
```javascript
{
  _id: "string",
  orderNumber: "string",
  customer: "ObjectId",
  items: [{
    product: "ObjectId",
    quantity: "number",
    price: "number",
    variant: {
      size: "string",
      color: "string"
    }
  }],
  pricing: {
    subtotal: "number",
    tax: "number",
    shipping: "number",
    discount: "number",
    total: "number"
  },
  shippingAddress: {
    firstName: "string",
    lastName: "string",
    street: "string",
    city: "string",
    state: "string",
    zipCode: "string",
    country: "string",
    phone: "string"
  },
  payment: {
    method: "credit_card|debit_card|paypal|stripe|cash_on_delivery",
    status: "pending|processing|completed|failed|refunded"
  },
  status: "pending|confirmed|processing|shipped|delivered|cancelled|returned"
}
```

## Setup and Installation

### Prerequisites
- Node.js 18+
- Backend API running on http://localhost:3000

### Installation

1. **Install all dependencies**
```bash
cd frontend
npm run install:all
```

2. **Start all micro-frontends**
```bash
npm start
```

3. **Start individual micro-frontends**
```bash
npm run start:shell      # Port 3000
npm run start:auth       # Port 3001
npm run start:products   # Port 3002
npm run start:cart       # Port 3003
npm run start:checkout   # Port 3004
npm run start:profile    # Port 3005
```

### Environment Configuration

Create `.env` files in each micro-frontend:

```env
REACT_APP_API_URL=http://localhost:3000
REACT_APP_SHELL_URL=http://localhost:3000
REACT_APP_AUTH_URL=http://localhost:3001
REACT_APP_PRODUCTS_URL=http://localhost:3002
REACT_APP_CART_URL=http://localhost:3003
REACT_APP_CHECKOUT_URL=http://localhost:3004
REACT_APP_PROFILE_URL=http://localhost:3005
```

## State Management

Each micro-frontend uses Redux Toolkit for state management:

- **Auth MF**: User authentication state
- **Products MF**: Product catalog, filters, search
- **Cart MF**: Shopping cart items and totals
- **Checkout MF**: Order processing and payment
- **Profile MF**: User profile and order history

## Key Features

### Authentication
- JWT-based authentication with refresh tokens
- Automatic token refresh on API calls
- Protected routes and components
- Role-based access control

### Products
- Product listing with pagination
- Advanced filtering and search
- Product details with variants
- Category navigation
- Inventory tracking

### Shopping Cart
- Add/remove items with variants
- Quantity updates
- Real-time price calculations
- Persistent cart across sessions

### Checkout
- Multi-step checkout process
- Address management
- Payment processing
- Order confirmation

### User Profile
- Profile information management
- Address book
- Order history
- Notification preferences

## Development Guidelines

### Component Structure
- Use functional components with hooks
- Implement proper error boundaries
- Follow consistent naming conventions
- Include proper TypeScript types

### API Integration
- Use the shared API service
- Implement proper error handling
- Show loading states
- Cache responses when appropriate

### State Management
- Keep state normalized
- Use Redux Toolkit for async operations
- Implement optimistic updates where appropriate
- Handle loading and error states

### Testing
```bash
npm test                 # Run all tests
npm run test:auth        # Test auth micro-frontend
npm run test:products    # Test products micro-frontend
```

### Building for Production
```bash
npm run build           # Build all micro-frontends
npm run build:shell     # Build shell application
npm run build:auth      # Build auth micro-frontend
```

## Deployment

Each micro-frontend can be deployed independently:

1. **Build the application**
2. **Deploy to CDN or static hosting**
3. **Update Module Federation remotes**
4. **Configure environment variables**

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure backend CORS is configured for frontend URLs
2. **Module Federation**: Check remote URLs in webpack config
3. **Authentication**: Verify JWT tokens and refresh logic
4. **API Errors**: Check network tab and backend logs

### Debug Mode
Set `NODE_ENV=development` to enable debug logging and detailed error messages.

## Contributing

1. Follow the established architecture patterns
2. Update API service when backend endpoints change
3. Maintain backward compatibility
4. Add proper error handling and loading states
5. Update documentation for new features