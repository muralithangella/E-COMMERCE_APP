const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [200, 'Product name cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: [0, 'Price cannot be negative']
  },
  originalPrice: {
    type: Number,
    min: [0, 'Original price cannot be negative']
  },
  discount: {
    type: Number,
    min: [0, 'Discount cannot be negative'],
    max: [100, 'Discount cannot exceed 100%'],
    default: 0
  },
  category: {
    type: String,
    required: [true, 'Product category is required'],
    enum: {
      values: ['Mobiles', 'Electronics', 'Fashion', 'Home & Kitchen', 'Books', 
               'Sports, Fitness & Outdoors', 'Beauty & Personal Care', 'Toys & Games',
               'Grocery & Gourmet Foods', 'Health & Household', 'Car & Motorbike', 'Baby'],
      message: 'Invalid category'
    }
  },
  subcategory: {
    type: String,
    trim: true
  },
  brand: {
    type: String,
    required: [true, 'Brand is required'],
    trim: true
  },
  sku: {
    type: String,
    required: [true, 'SKU is required'],
    unique: true,
    trim: true
  },
  images: [{
    url: String,
    alt: String,
    isPrimary: { type: Boolean, default: false }
  }],
  specifications: {
    type: Map,
    of: String
  },
  inventory: {
    quantity: {
      type: Number,
      required: [true, 'Inventory quantity is required'],
      min: [0, 'Quantity cannot be negative']
    },
    reserved: {
      type: Number,
      default: 0,
      min: [0, 'Reserved quantity cannot be negative']
    },
    lowStockThreshold: {
      type: Number,
      default: 10,
      min: [0, 'Low stock threshold cannot be negative']
    }
  },
  rating: {
    average: {
      type: Number,
      min: [0, 'Rating cannot be less than 0'],
      max: [5, 'Rating cannot be more than 5'],
      default: 0
    },
    count: {
      type: Number,
      default: 0,
      min: [0, 'Rating count cannot be negative']
    }
  },
  reviews: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Review'
  }],
  tags: [String],
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  weight: {
    value: Number,
    unit: { type: String, enum: ['kg', 'g', 'lb'], default: 'kg' }
  },
  dimensions: {
    length: Number,
    width: Number,
    height: Number,
    unit: { type: String, enum: ['cm', 'inch'], default: 'cm' }
  },
  seo: {
    metaTitle: String,
    metaDescription: String,
    slug: {
      type: String,
      unique: true,
      lowercase: true
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance
productSchema.index({ category: 1, isActive: 1 });
productSchema.index({ price: 1 });
productSchema.index({ 'rating.average': -1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ sku: 1 });
productSchema.index({ 'seo.slug': 1 });
productSchema.index({ name: 'text', description: 'text' });

// Virtual for available quantity
productSchema.virtual('availableQuantity').get(function() {
  return this.inventory.quantity - this.inventory.reserved;
});

// Virtual for discount percentage
productSchema.virtual('discountPercentage').get(function() {
  if (this.originalPrice && this.originalPrice > this.price) {
    return Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
  }
  return this.discount || 0;
});

// Pre-save middleware
productSchema.pre('save', function(next) {
  if (this.isNew || this.isModified('name')) {
    this.seo.slug = this.name.toLowerCase()
      .replace(/[^\w ]+/g, '')
      .replace(/ +/g, '-');
  }
  
  if (this.originalPrice && this.price && this.originalPrice > this.price) {
    this.discount = Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
  }
  
  next();
});

// Static methods
productSchema.statics.findByCategory = function(category) {
  return this.find({ category, isActive: true });
};

productSchema.statics.findFeatured = function() {
  return this.find({ isFeatured: true, isActive: true });
};

productSchema.statics.findLowStock = function() {
  return this.find({
    $expr: {
      $lte: ['$inventory.quantity', '$inventory.lowStockThreshold']
    },
    isActive: true
  });
};

module.exports = mongoose.model('Product', productSchema);