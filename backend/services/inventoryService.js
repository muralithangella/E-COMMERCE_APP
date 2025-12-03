const Product = require('../models/Product');
const KafkaManager = require('../config/kafka');

class InventoryService {
  async updateStock(productId, quantity, operation = 'set') {
    try {
      const product = await Product.findById(productId);
      if (!product) {
        throw new Error('Product not found');
      }

      const oldQuantity = product.inventory.quantity;
      let newQuantity;

      switch (operation) {
        case 'add':
          newQuantity = oldQuantity + quantity;
          break;
        case 'subtract':
          newQuantity = Math.max(0, oldQuantity - quantity);
          break;
        default:
          newQuantity = quantity;
      }

      product.inventory.quantity = newQuantity;
      await product.save();

      await KafkaManager.publishInventoryEvent('STOCK_UPDATED', {
        productId,
        productName: product.name,
        oldQuantity,
        newQuantity,
        operation
      });

      if (newQuantity <= product.inventory.lowStockThreshold) {
        await this.sendLowStockAlert(product);
      }

      return product;
    } catch (error) {
      console.error('Stock update failed:', error);
      throw error;
    }
  }

  async reserveStock(items, orderId) {
    const session = await Product.startSession();
    
    try {
      await session.withTransaction(async () => {
        const reservations = [];

        for (const item of items) {
          const product = await Product.findById(item.productId).session(session);
          
          if (!product) {
            throw new Error(`Product ${item.productId} not found`);
          }

          if (product.inventory.quantity < item.quantity) {
            throw new Error(`Insufficient stock for ${product.name}. Available: ${product.inventory.quantity}, Requested: ${item.quantity}`);
          }

          product.inventory.quantity -= item.quantity;
          await product.save({ session });

          reservations.push({
            productId: item.productId,
            productName: product.name,
            quantity: item.quantity
          });
        }

        await KafkaManager.publishInventoryEvent('STOCK_RESERVED', {
          orderId,
          reservations
        });

        return reservations;
      });
    } catch (error) {
      console.error('Stock reservation failed:', error);
      throw error;
    } finally {
      await session.endSession();
    }
  }

  async releaseStock(items, orderId) {
    try {
      for (const item of items) {
        const product = await Product.findById(item.productId);
        if (product) {
          product.inventory.quantity += item.quantity;
          await product.save();
        }
      }

      await KafkaManager.publishInventoryEvent('STOCK_RELEASED', {
        orderId,
        items
      });
    } catch (error) {
      console.error('Stock release failed:', error);
      throw error;
    }
  }

  async checkLowStock() {
    try {
      const lowStockProducts = await Product.find({
        $expr: { $lte: ['$inventory.quantity', '$inventory.lowStockThreshold'] },
        status: 'published'
      });

      for (const product of lowStockProducts) {
        await this.sendLowStockAlert(product);
      }

      return lowStockProducts;
    } catch (error) {
      console.error('Low stock check failed:', error);
      throw error;
    }
  }

  async sendLowStockAlert(product) {
    await KafkaManager.publishInventoryEvent('LOW_STOCK_ALERT', {
      productId: product._id,
      productName: product.name,
      currentStock: product.inventory.quantity,
      threshold: product.inventory.lowStockThreshold,
      sku: product.sku
    });
  }

  async getInventoryReport() {
    try {
      const [totalProducts, lowStockCount, outOfStockCount] = await Promise.all([
        Product.countDocuments({ status: 'published' }),
        Product.countDocuments({
          $expr: { $lte: ['$inventory.quantity', '$inventory.lowStockThreshold'] },
          status: 'published'
        }),
        Product.countDocuments({ 'inventory.quantity': 0, status: 'published' })
      ]);

      return {
        totalProducts,
        lowStockCount,
        outOfStockCount,
        inStockCount: totalProducts - outOfStockCount
      };
    } catch (error) {
      console.error('Inventory report generation failed:', error);
      throw error;
    }
  }
}

module.exports = new InventoryService();