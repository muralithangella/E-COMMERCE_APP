const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  category: { type: String, required: true },
  brand: { type: String, required: true },
  sku: { type: String, required: true, unique: true },
  inventory: {
    quantity: { type: Number, required: true, min: 0 },
    reserved: { type: Number, default: 0 }
  },
  rating: { average: { type: Number, default: 0 }, count: { type: Number, default: 0 } },
  discount: { type: Number, default: 0, min: 0 },
  images: [{
    url: { type: String, required: true },
    publicId: { type: String, required: true },
    isPrimary: { type: Boolean, default: false }
  }],
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

productSchema.index({ category: 1, isActive: 1 });

module.exports = mongoose.model('Product', productSchema);
