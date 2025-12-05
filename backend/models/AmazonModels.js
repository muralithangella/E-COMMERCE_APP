const mongoose = require('mongoose');

// User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String },
  avatar: { type: String },
  dateOfBirth: { type: Date },
  gender: { type: String, enum: ['Male', 'Female', 'Other'] },
  prime: {
    isActive: { type: Boolean, default: false },
    plan: { type: String, enum: ['monthly', 'yearly', 'student'] },
    startDate: { type: Date },
    endDate: { type: Date }
  },
  addresses: [{
    name: { type: String, required: true },
    phone: { type: String, required: true },
    addressLine1: { type: String, required: true },
    addressLine2: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    landmark: { type: String },
    type: { type: String, enum: ['Home', 'Work', 'Other'], default: 'Home' },
    isDefault: { type: Boolean, default: false }
  }],
  paymentMethods: [{
    type: { type: String, enum: ['card', 'upi', 'netbanking'], required: true },
    cardNumber: { type: String }, // Last 4 digits only
    cardType: { type: String, enum: ['Visa', 'Mastercard', 'RuPay', 'Amex'] },
    expiryMonth: { type: Number },
    expiryYear: { type: Number },
    cardholderName: { type: String },
    upiId: { type: String },
    bankName: { type: String },
    isDefault: { type: Boolean, default: false }
  }],
  preferences: {
    language: { type: String, default: 'English' },
    currency: { type: String, default: 'INR' },
    notifications: {
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: true },
      push: { type: Boolean, default: true }
    }
  },
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  recentlyViewed: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  isActive: { type: Boolean, default: true },
  lastLogin: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Product Schema
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  shortDescription: { type: String },
  brand: { type: String, required: true },
  model: { type: String },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  subcategory: { type: String },
  sku: { type: String, unique: true },
  
  pricing: {
    price: { type: Number, required: true },
    originalPrice: { type: Number },
    discount: { type: Number, default: 0 },
    currency: { type: String, default: 'INR' }
  },
  
  images: [{
    url: { type: String, required: true },
    alt: { type: String },
    isPrimary: { type: Boolean, default: false }
  }],
  
  specifications: {
    type: Map,
    of: String
  },
  
  features: [{ type: String }],
  
  inventory: {
    inStock: { type: Boolean, default: true },
    quantity: { type: Number, default: 0 },
    lowStockThreshold: { type: Number, default: 10 },
    sku: { type: String }
  },
  
  shipping: {
    weight: { type: Number }, // in grams
    dimensions: {
      length: { type: Number },
      width: { type: Number },
      height: { type: Number }
    },
    freeDelivery: { type: Boolean, default: false },
    deliveryTime: { type: String, default: '3-5 days' }
  },
  
  ratings: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 },
    distribution: {
      5: { type: Number, default: 0 },
      4: { type: Number, default: 0 },
      3: { type: Number, default: 0 },
      2: { type: Number, default: 0 },
      1: { type: Number, default: 0 }
    }
  },
  
  seller: {
    name: { type: String, required: true },
    id: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller' },
    rating: { type: Number, default: 0 }
  },
  
  variants: [{
    name: { type: String }, // Color, Size, etc.
    value: { type: String },
    price: { type: Number },
    sku: { type: String },
    inStock: { type: Boolean, default: true }
  }],
  
  tags: [{ type: String }],
  
  seo: {
    metaTitle: { type: String },
    metaDescription: { type: String },
    slug: { type: String, unique: true }
  },
  
  prime: { type: Boolean, default: false },
  bestseller: { type: Boolean, default: false },
  featured: { type: Boolean, default: false },
  
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Category Schema
const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String },
  image: { type: String },
  icon: { type: String },
  parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  children: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
  level: { type: Number, default: 0 },
  sortOrder: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  seo: {
    metaTitle: { type: String },
    metaDescription: { type: String }
  },
  createdAt: { type: Date, default: Date.now }
});

// Order Schema
const orderSchema = new mongoose.Schema({
  orderNumber: { type: String, required: true, unique: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    variant: { type: String },
    seller: { type: String }
  }],
  
  pricing: {
    subtotal: { type: Number, required: true },
    tax: { type: Number, default: 0 },
    shipping: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    total: { type: Number, required: true }
  },
  
  shippingAddress: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    addressLine1: { type: String, required: true },
    addressLine2: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    landmark: { type: String }
  },
  
  payment: {
    method: { type: String, required: true },
    status: { type: String, enum: ['pending', 'completed', 'failed', 'refunded'], default: 'pending' },
    transactionId: { type: String },
    gateway: { type: String },
    paidAt: { type: Date }
  },
  
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'out_for_delivery', 'delivered', 'cancelled', 'returned'],
    default: 'pending'
  },
  
  tracking: {
    trackingNumber: { type: String },
    carrier: { type: String },
    updates: [{
      status: { type: String },
      description: { type: String },
      location: { type: String },
      timestamp: { type: Date, default: Date.now }
    }]
  },
  
  delivery: {
    estimatedDate: { type: Date },
    actualDate: { type: Date },
    instructions: { type: String }
  },
  
  coupon: {
    code: { type: String },
    discount: { type: Number }
  },
  
  notes: { type: String },
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Review Schema
const reviewSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
  
  rating: { type: Number, required: true, min: 1, max: 5 },
  title: { type: String },
  comment: { type: String },
  
  images: [{ type: String }],
  
  verified: { type: Boolean, default: false },
  
  helpful: {
    count: { type: Number, default: 0 },
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
  },
  
  reported: {
    count: { type: Number, default: 0 },
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
  },
  
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

// Cart Schema
const cartSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true, min: 1 },
    variant: { type: String },
    addedAt: { type: Date, default: Date.now }
  }],
  
  updatedAt: { type: Date, default: Date.now }
});

// Coupon Schema
const couponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String },
  
  type: { type: String, enum: ['percentage', 'fixed'], required: true },
  value: { type: Number, required: true },
  
  minOrderValue: { type: Number, default: 0 },
  maxDiscount: { type: Number },
  
  usageLimit: { type: Number },
  usedCount: { type: Number, default: 0 },
  
  applicableCategories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
  applicableProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  
  validFrom: { type: Date, required: true },
  validTill: { type: Date, required: true },
  
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

// Banner Schema
const bannerSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subtitle: { type: String },
  description: { type: String },
  
  image: {
    desktop: { type: String, required: true },
    mobile: { type: String },
    tablet: { type: String }
  },
  
  link: {
    url: { type: String },
    type: { type: String, enum: ['internal', 'external'], default: 'internal' }
  },
  
  cta: { type: String },
  
  position: { type: String, enum: ['hero', 'sidebar', 'footer'], default: 'hero' },
  sortOrder: { type: Number, default: 0 },
  
  targeting: {
    categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
    userSegments: [{ type: String }]
  },
  
  schedule: {
    startDate: { type: Date },
    endDate: { type: Date }
  },
  
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

// Seller Schema
const sellerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  
  businessInfo: {
    businessName: { type: String, required: true },
    gst: { type: String },
    pan: { type: String },
    address: {
      line1: { type: String, required: true },
      line2: { type: String },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true }
    }
  },
  
  bankDetails: {
    accountNumber: { type: String },
    ifsc: { type: String },
    bankName: { type: String },
    accountHolderName: { type: String }
  },
  
  rating: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 }
  },
  
  performance: {
    totalOrders: { type: Number, default: 0 },
    totalRevenue: { type: Number, default: 0 },
    returnRate: { type: Number, default: 0 },
    responseTime: { type: Number, default: 24 } // in hours
  },
  
  isVerified: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

// Create indexes for better performance
userSchema.index({ email: 1 });
productSchema.index({ name: 'text', description: 'text', brand: 'text' });
productSchema.index({ category: 1, 'pricing.price': 1 });
productSchema.index({ 'ratings.average': -1 });
orderSchema.index({ user: 1, createdAt: -1 });
reviewSchema.index({ product: 1, createdAt: -1 });

// Export models
module.exports = {
  User: mongoose.model('User', userSchema),
  Product: mongoose.model('Product', productSchema),
  Category: mongoose.model('Category', categorySchema),
  Order: mongoose.model('Order', orderSchema),
  Review: mongoose.model('Review', reviewSchema),
  Cart: mongoose.model('Cart', cartSchema),
  Coupon: mongoose.model('Coupon', couponSchema),
  Banner: mongoose.model('Banner', bannerSchema),
  Seller: mongoose.model('Seller', sellerSchema)
};