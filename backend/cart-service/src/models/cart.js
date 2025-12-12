const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
  image: String
});

const cartSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  sessionId: { type: String, index: true },
  items: [cartItemSchema],
  total: { type: Number, default: 0 },
  count: { type: Number, default: 0 }
}, { timestamps: true });

cartSchema.methods.calculateTotals = function() {
  this.count = this.items.reduce((sum, item) => sum + item.quantity, 0);
  this.total = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
};

module.exports = mongoose.model('Cart', cartSchema);