const mongoose = require('mongoose');

// Lightweight product schema for cart lookups; points to the same collection used by product-service
const productSchema = new mongoose.Schema({
  name: String,
  price: {
    regular: Number,
    sale: Number,
  },
  images: [{
    url: String,
  }],
  discount: {
    percentage: Number,
  }
}, { collection: 'products' });

module.exports = mongoose.model('Product', productSchema);

