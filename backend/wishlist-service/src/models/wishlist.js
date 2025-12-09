const mongoose = require('mongoose');

const wishlistItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  addedAt: {
    type: Date,
    default: Date.now
  },
  notes: {
    type: String,
    maxlength: 500
  },
  priceWhenAdded: {
    type: Number
  },
  variant: {
    size: String,
    color: String,
    other: mongoose.Schema.Types.Mixed
  }
});

const wishlistSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  name: {
    type: String,
    default: 'My Wishlist',
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    maxlength: 500
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  shareToken: {
    type: String,
    unique: true,
    sparse: true
  },
  items: [wishlistItemSchema],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes
wishlistSchema.index({ user: 1, name: 1 });
wishlistSchema.index({ shareToken: 1 });

// Prevent duplicate products in wishlist
wishlistSchema.methods.addItem = async function(productId, options = {}) {
  const existingItem = this.items.find(
    item => item.product.toString() === productId.toString()
  );

  if (existingItem) {
    throw new Error('Product already in wishlist');
  }

  this.items.push({
    product: productId,
    ...options,
    addedAt: new Date()
  });

  this.updatedAt = new Date();
  return this.save();
};

wishlistSchema.methods.removeItem = function(productId) {
  this.items = this.items.filter(
    item => item.product.toString() !== productId.toString()
  );
  this.updatedAt = new Date();
  return this.save();
};

// Generate share token
wishlistSchema.methods.generateShareToken = function() {
  const crypto = require('crypto');
  this.shareToken = crypto.randomBytes(16).toString('hex');
  return this.save();
};

module.exports = mongoose.model('Wishlist', wishlistSchema);

