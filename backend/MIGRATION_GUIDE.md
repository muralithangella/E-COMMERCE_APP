# Backend Restructuring - Migration Guide

## Overview

The backend has been restructured from a **flat architecture** to a **modular domain-driven architecture**, following the pattern from the `social-media-microservices` project.

## What Changed

### Before (Flat Structure)
```
src/
├── models/              # All models together
├── controllers/         # All controllers together
├── services/            # All services together
├── routes/              # All routes together
└── utils/               # All utilities together
```

### After (Modular Structure)
```
src/
├── modules/
│   ├── product/         # Everything product-related
│   │   ├── models/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── routes/
│   │   └── utils/
│   ├── cart/            # Everything cart-related
│   ├── order/           # Everything order-related
│   ├── auth/            # Everything auth-related
│   └── user/            # Everything user-related
├── config/              # Shared configuration
├── middleware/          # Shared middleware
└── utils/               # Shared utilities
```

## Completed Modules

### ✅ Product Module
- **Location**: `src/modules/product/`
- **Files**:
  - `models/Product.js` - Product schema
  - `controllers/productController.js` - Request handlers
  - `services/productService.js` - Business logic
  - `routes/productRoutes.js` - API routes
  - `index.js` - Module exports

### ✅ Cart Module
- **Location**: `src/modules/cart/`
- **Files**:
  - `models/Cart.js` - Cart schema
  - `controllers/cartController.js` - Request handlers
  - `routes/cartRoutes.js` - API routes
  - `index.js` - Module exports

### ✅ Order Module
- **Location**: `src/modules/order/`
- **Files**:
  - `models/Order.js` - Order schema
  - `controllers/orderController.js` - Request handlers
  - `services/orderService.js` - Business logic
  - `routes/orderRoutes.js` - API routes
  - `index.js` - Module exports

### ✅ Auth Module
- **Location**: `src/modules/auth/`
- **Files**:
  - `controllers/authController.js` - Auth handlers
  - `services/authService.js` - JWT & token logic
  - `routes/authRoutes.js` - Auth routes
  - `index.js` - Module exports

### ✅ User Module
- **Location**: `src/modules/user/`
- **Files**:
  - `models/User.js` - User schema
  - `routes/userRoutes.js` - User routes
  - `index.js` - Module exports

## Ready for Implementation

The following module directories are created and ready for implementation:

- `src/modules/payment/` - Payment processing
- `src/modules/inventory/` - Inventory management
- `src/modules/notification/` - Email/SMS notifications
- `src/modules/category/` - Product categories

## Updated Files

### `src/app.js`
Routes now point to modular structure:
```javascript
// Old
this.app.use('/api/products', require('./routes/productRoutes'));

// New
this.app.use('/api/products', require('./modules/product/routes/productRoutes'));
```

## Import Changes

### Old Way
```javascript
const Product = require('../models/Product');
const productController = require('../controllers/ProductController');
```

### New Way
```javascript
// Import specific component
const Product = require('../modules/product/models/Product');
const productController = require('../modules/product/controllers/productController');

// Or import entire module
const productModule = require('../modules/product');
const Product = productModule.model;
```

## Benefits

1. **Scalability** - Easy to extract modules into separate microservices
2. **Maintainability** - Clear organization, easy to find code
3. **Team Collaboration** - Teams can work on different modules independently
4. **Testing** - Easier to write isolated tests per module
5. **Reusability** - Modules can be reused across projects

## Next Steps

1. ✅ Core modules created (product, cart, order, auth, user)
2. ⏳ Implement remaining modules (payment, inventory, notification, category)
3. ⏳ Add module-specific utilities as needed
4. ⏳ Write unit tests for each module
5. ⏳ Consider extracting modules to microservices if needed

## Rollback

Old files remain in their original locations:
- `src/models/`
- `src/controllers/`
- `src/services/`
- `src/routes/`

To rollback, simply revert `src/app.js` to use old paths.

## Questions?

Refer to `src/modules/README.md` for detailed documentation.
