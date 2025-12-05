# Amazon India Replica - Complete E-commerce Application

A comprehensive replica of Amazon India with all major features and functionality.

## 🚀 Features

### Frontend Features
- **Amazon-style Header** with search, location, account menu, cart
- **Homepage** with banners, deals, categories, recommendations
- **Product Listing** with filters, sorting, pagination
- **Product Details** with images, specifications, reviews
- **Shopping Cart** with quantity management
- **Wishlist** functionality
- **User Authentication** (login/register)
- **Order Management** and tracking
- **Responsive Design** for all devices

### Backend Features
- **240+ Products** across 12 categories
- **Advanced Search** with filters and suggestions
- **Cart Management** with persistence
- **Order Processing** with status tracking
- **User Management** with authentication
- **Wishlist** functionality
- **Deals and Offers** system
- **Review and Rating** system
- **Address Management**
- **Payment Methods** handling
- **Coupon System**

## 📊 Database

### Products
- 240+ products across 12 categories
- Real product data with images, specifications
- Price, discount, rating information
- Brand and seller details
- Stock management

### Categories
- Mobiles
- Electronics  
- Fashion
- Home & Kitchen
- Beauty & Personal Care
- Books
- Sports, Fitness & Outdoors
- Toys & Games
- Grocery & Gourmet Foods
- Health & Household
- Car & Motorbike
- Baby

### Sample Data
- Users with addresses and payment methods
- Orders with tracking information
- Reviews and ratings
- Coupons and deals

## 🛠️ Quick Start

1. **Install dependencies**
```bash
npm run install:all
```

2. **Start Amazon replica**
```bash
npm run start:all:amazon
```

Or start services individually:

```bash
# Backend (Amazon complete server)
npm run start:amazon

# Frontend services
npm run start:shell
npm run start:products  
npm run start:cart
```

## 📡 API Endpoints

### Products
- `GET /api/products` - Get products with filters
- `GET /api/products/:id` - Get product details
- `GET /api/categories` - Get all categories
- `GET /api/deals` - Get today's deals
- `GET /api/search/suggestions` - Search suggestions

### Cart & Wishlist
- `GET /api/cart` - Get cart items
- `POST /api/cart/add` - Add to cart
- `GET /api/wishlist` - Get wishlist
- `POST /api/wishlist/add` - Add to wishlist

### Orders
- `GET /api/orders` - Get user orders
- `POST /api/orders` - Place new order
- `GET /api/orders/:id` - Get order details

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Other Features
- `GET /api/banners` - Homepage banners
- `GET /api/coupons` - Available coupons
- `POST /api/coupons/apply` - Apply coupon
- `GET /api/recommendations` - Product recommendations

## 🌐 Access Points

- **Main Application**: http://localhost:3000
- **Products Service**: http://localhost:3001  
- **Cart Service**: http://localhost:3002
- **Backend API**: http://localhost:5000

## 🎨 Amazon India Features Implemented

### Header & Navigation
- Amazon-style logo and branding
- Location selector with pincode
- Search bar with category filter
- Account menu with sign-in options
- Cart with item count
- Prime membership integration
- Language selector (EN/Hindi)

### Homepage
- Hero banners with auto-rotation
- Today's deals with countdown timers
- Category showcase sections
- Brand highlights
- Prime benefits banner
- Recently viewed items
- Personalized recommendations

### Product Listing
- Advanced filtering (brand, price, rating)
- Multiple sorting options
- Grid/list view toggle
- Pagination
- Product comparison
- Wishlist integration

### Product Details
- Multiple product images
- Detailed specifications
- Customer reviews and ratings
- Related products
- Add to cart/wishlist
- Seller information
- Delivery options

### Shopping Experience
- Persistent cart across sessions
- Quantity management
- Price calculations with taxes
- Delivery fee calculations
- Coupon application
- Multiple payment options

## 🔧 Technical Stack

- **Frontend**: React, Redux, CSS3
- **Backend**: Node.js, Express
- **Database**: In-memory (easily replaceable with MongoDB)
- **Authentication**: JWT tokens
- **Styling**: Amazon India color scheme and fonts
- **Architecture**: Microservices with micro-frontends

## 📱 Responsive Design

- Mobile-first approach
- Tablet optimization
- Desktop full features
- Touch-friendly interface
- Fast loading times

## 🚀 Production Ready

- Security headers with Helmet
- CORS protection  
- Rate limiting
- Error handling
- Logging system
- Performance optimization
- SEO friendly URLs

## 📈 Scalability

- Microservices architecture
- Horizontal scaling ready
- Database abstraction
- Caching layer support
- Load balancer ready

This is a complete Amazon India replica with all major e-commerce features implemented!
