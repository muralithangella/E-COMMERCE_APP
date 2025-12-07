# Quick Reference Guide

## 📁 Where to Find Things

### Product Related
- **Model**: `src/modules/product/models/Product.js`
- **Controller**: `src/modules/product/controllers/productController.js`
- **Service**: `src/modules/product/services/productService.js`
- **Routes**: `src/modules/product/routes/productRoutes.js`

### Cart Related
- **Model**: `src/modules/cart/models/Cart.js`
- **Controller**: `src/modules/cart/controllers/cartController.js`
- **Routes**: `src/modules/cart/routes/cartRoutes.js`

### Order Related
- **Model**: `src/modules/order/models/Order.js`
- **Controller**: `src/modules/order/controllers/orderController.js`
- **Service**: `src/modules/order/services/orderService.js`
- **Routes**: `src/modules/order/routes/orderRoutes.js`

### Authentication
- **Controller**: `src/modules/auth/controllers/authController.js`
- **Service**: `src/modules/auth/services/authService.js`
- **Routes**: `src/modules/auth/routes/authRoutes.js`

### User Related
- **Model**: `src/modules/user/models/User.js`
- **Routes**: `src/modules/user/routes/userRoutes.js`

### Shared Resources
- **Middleware**: `src/middleware/`
- **Config**: `src/config/`
- **Utils**: `src/utils/`
- **Workers**: `src/workers/`

## 🚀 Common Tasks

### Adding a New Module

1. Create module directory:
```bash
mkdir src/modules/your-module
mkdir src/modules/your-module/{models,controllers,services,routes,utils}
```

2. Create files:
```bash
# Model
touch src/modules/your-module/models/YourModel.js

# Controller
touch src/modules/your-module/controllers/yourController.js

# Service
touch src/modules/your-module/services/yourService.js

# Routes
touch src/modules/your-module/routes/yourRoutes.js

# Index
touch src/modules/your-module/index.js
```

3. Register routes in `src/app.js`:
```javascript
this.app.use('/api/your-module', require('./modules/your-module/routes/yourRoutes'));
```

### Adding a New Route

1. Add route in `routes/yourRoutes.js`:
```javascript
router.get('/new-endpoint', controller.newHandler);
```

2. Add controller in `controllers/yourController.js`:
```javascript
const newHandler = async (req, res) => {
  const result = await service.newFunction(req.params);
  res.json(result);
};
```

3. Add service in `services/yourService.js`:
```javascript
const newFunction = async (params) => {
  // Business logic here
  return result;
};
```

### Adding a New Model

Create in `models/YourModel.js`:
```javascript
const mongoose = require('mongoose');

const yourSchema = new mongoose.Schema({
  field1: { type: String, required: true },
  field2: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('YourModel', yourSchema);
```

## 📝 Import Patterns

### Import from Same Module
```javascript
// In controller
const service = require('../services/productService');
const Product = require('../models/Product');
```

### Import from Another Module
```javascript
// In order module, importing User
const User = require('../../user/models/User');
```

### Import Shared Resources
```javascript
// Import middleware
const { authenticate } = require('../../../middleware');

// Import utils
const logger = require('../../../utils/logger');

// Import config
const database = require('../../../config/database');
```

### Import Entire Module
```javascript
const productModule = require('../modules/product');
const Product = productModule.model;
const productService = productModule.service;
```

## 🔧 Configuration

### Environment Variables
Edit `.env` file:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret
```

### Database Connection
Located in: `src/config/database.js`

### Middleware Configuration
Located in: `src/middleware/`

## 🧪 Testing

### Test a Module
```bash
npm test -- src/modules/product
```

### Test All Modules
```bash
npm test
```

## 📊 API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `GET /api/products/featured` - Get featured products
- `GET /api/products/deals` - Get deals

### Cart
- `GET /api/cart` - Get cart (auth required)
- `POST /api/cart/add` - Add to cart (auth required)
- `PUT /api/cart/items/:itemId` - Update cart item (auth required)
- `DELETE /api/cart/items/:itemId` - Remove from cart (auth required)
- `DELETE /api/cart/clear` - Clear cart (auth required)

### Orders
- `POST /api/orders` - Create order (auth required)
- `GET /api/orders` - Get orders (auth required)
- `GET /api/orders/:id` - Get order by ID (auth required)
- `PUT /api/orders/:id/status` - Update order status (auth required)
- `DELETE /api/orders/:id` - Cancel order (auth required)

### Auth
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/refresh-token` - Refresh token
- `POST /api/auth/forgot-password` - Forgot password
- `POST /api/auth/reset-password` - Reset password

### Users
- `GET /api/users/profile` - Get user profile (auth required)

## 🐛 Debugging

### Check Module Structure
```bash
tree /F src\modules
```

### Test Module Import
```bash
node -e "require('./src/modules/product')"
```

### Check Routes
```bash
node -e "const app = require('./src/app'); console.log(app._router.stack)"
```

## 📚 Documentation Files

- `README.md` - Main project documentation
- `src/modules/README.md` - Module architecture
- `MIGRATION_GUIDE.md` - Migration instructions
- `RESTRUCTURE_SUMMARY.md` - Restructure summary
- `STRUCTURE_DIAGRAM.md` - Visual structure
- `QUICK_REFERENCE.md` - This file

## 💡 Tips

1. **Keep modules independent** - Minimize cross-module dependencies
2. **Use services for business logic** - Keep controllers thin
3. **Validate input** - Use middleware for validation
4. **Handle errors** - Use try-catch and error middleware
5. **Document your code** - Add comments for complex logic
6. **Follow naming conventions** - Be consistent
7. **Write tests** - Test each module independently

## 🔗 Useful Commands

```bash
# Start server
npm start

# Development mode
npm run dev

# Run tests
npm test

# Lint code
npm run lint

# Fix lint issues
npm run lint:fix

# Install dependencies
npm install

# Seed database
node src/scripts/seed-data.js
```

## 📞 Need Help?

- Check `src/modules/README.md` for detailed module documentation
- Check `MIGRATION_GUIDE.md` for migration instructions
- Check `STRUCTURE_DIAGRAM.md` for visual structure
- Review existing modules for examples
