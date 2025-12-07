const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1
  }
}, { _id: true });

const cartSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    default: 'guest'
  },
  items: [cartItemSchema],
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

cartSchema.virtual('total').get(function() {
  return this.items.reduce((sum, item) => {
    return sum + (item.productId.price * item.quantity);
  }, 0);
});

cartSchema.virtual('count').get(function() {
  return this.items.reduce((sum, item) => sum + item.quantity, 0);
});

cartSchema.index({ userId: 1 });

module.exports = mongoose.model('Cart', cartSchema);