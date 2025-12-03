const Product = require('../models/Product');
const KafkaManager = require('../config/kafka');

const getInventory = async (req, res) => {
  try {
    const { page = 1, limit = 20, lowStock } = req.query;
    const filter = {};
    
    if (lowStock === 'true') {
      filter.$expr = { $lt: ['$inventory.quantity', '$inventory.lowStockThreshold'] };
    }
    
    const products = await Product.find(filter)
      .select('name sku inventory.quantity inventory.lowStockThreshold')
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Product.countDocuments(filter);
    
    res.json({ products, total, totalPages: Math.ceil(total / limit), currentPage: page });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch inventory', error: error.message });
  }
};

const updateStock = async (req, res) => {
  try {
    const { productId, quantity, operation = 'set' } = req.body;
    
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    let newQuantity;
    switch (operation) {
      case 'add':
        newQuantity = product.inventory.quantity + quantity;
        break;
      case 'subtract':
        newQuantity = Math.max(0, product.inventory.quantity - quantity);
        break;
      default:
        newQuantity = quantity;
    }
    
    product.inventory.quantity = newQuantity;
    await product.save();
    
    await KafkaManager.publishInventoryEvent('STOCK_UPDATED', {
      productId,
      oldQuantity: product.inventory.quantity,
      newQuantity,
      operation
    });
    
    if (newQuantity <= product.inventory.lowStockThreshold) {
      await KafkaManager.publishInventoryEvent('LOW_STOCK_ALERT', {
        productId,
        productName: product.name,
        currentStock: newQuantity,
        threshold: product.inventory.lowStockThreshold
      });
    }
    
    res.json({ message: 'Stock updated successfully', product });
  } catch (error) {
    res.status(400).json({ message: 'Failed to update stock', error: error.message });
  }
};

const reserveStock = async (req, res) => {
  try {
    const { items } = req.body; // [{ productId, quantity }]
    const reservations = [];
    
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ message: `Product ${item.productId} not found` });
      }
      
      if (product.inventory.quantity < item.quantity) {
        return res.status(400).json({ 
          message: `Insufficient stock for ${product.name}`,
          available: product.inventory.quantity,
          requested: item.quantity
        });
      }
      
      product.inventory.quantity -= item.quantity;
      await product.save();
      
      reservations.push({
        productId: item.productId,
        quantity: item.quantity,
        reserved: true
      });
    }
    
    await KafkaManager.publishInventoryEvent('STOCK_RESERVED', {
      reservations,
      orderId: req.body.orderId
    });
    
    res.json({ message: 'Stock reserved successfully', reservations });
  } catch (error) {
    res.status(400).json({ message: 'Failed to reserve stock', error: error.message });
  }
};

const releaseStock = async (req, res) => {
  try {
    const { items } = req.body; // [{ productId, quantity }]
    
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (product) {
        product.inventory.quantity += item.quantity;
        await product.save();
      }
    }
    
    await KafkaManager.publishInventoryEvent('STOCK_RELEASED', {
      items,
      orderId: req.body.orderId
    });
    
    res.json({ message: 'Stock released successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Failed to release stock', error: error.message });
  }
};

module.exports = {
  getInventory,
  updateStock,
  reserveStock,
  releaseStock
};