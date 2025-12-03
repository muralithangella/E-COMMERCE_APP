const KafkaManager = require('../config/kafka');
const Product = require('../models/Product');
const User = require('../models/User');
const NotificationService = require('../services/notificationService');

class InventoryWorker {
  async start() {
    console.log('Starting Inventory Worker...');
    
    await KafkaManager.consumeEvents(
      'inventory-worker-group',
      ['inventory-events'],
      this.handleInventoryEvent.bind(this)
    );
  }

  async handleInventoryEvent(topic, message) {
    const { eventType, data } = message;
    
    try {
      switch (eventType) {
        case 'LOW_STOCK_ALERT':
          await this.handleLowStockAlert(data);
          break;
        case 'STOCK_UPDATED':
          await this.handleStockUpdated(data);
          break;
        case 'STOCK_RESERVED':
          await this.handleStockReserved(data);
          break;
        case 'STOCK_RELEASED':
          await this.handleStockReleased(data);
          break;
        default:
          console.log(`Unhandled inventory event: ${eventType}`);
      }
    } catch (error) {
      console.error(`Error processing inventory event ${eventType}:`, error);
    }
  }

  async handleLowStockAlert(data) {
    const { productId, productName, currentStock, threshold } = data;
    
    // Get admin users
    const adminUsers = await User.find({ role: 'admin', isActive: true });
    
    if (adminUsers.length > 0) {
      const product = await Product.findById(productId);
      
      if (product) {
        await NotificationService.sendLowStockNotification(product, adminUsers);
        console.log(`Low stock alert sent for product: ${productName} (${currentStock} remaining)`);
      }
    }
  }

  async handleStockUpdated(data) {
    const { productId, productName, oldQuantity, newQuantity, operation } = data;
    
    console.log(`Stock updated for ${productName}: ${oldQuantity} -> ${newQuantity} (${operation})`);
    
    // Update product search index if needed
    await this.updateProductSearchIndex(productId);
  }

  async handleStockReserved(data) {
    const { orderId, reservations } = data;
    
    console.log(`Stock reserved for order ${orderId}:`, reservations);
  }

  async handleStockReleased(data) {
    const { orderId, items } = data;
    
    console.log(`Stock released for order ${orderId}:`, items);
  }

  async updateProductSearchIndex(productId) {
    // Update search index or cache invalidation
    // This could integrate with Elasticsearch or other search engines
    console.log(`Updating search index for product ${productId}`);
  }

  async checkLowStockProducts() {
    try {
      const lowStockProducts = await Product.find({
        $expr: { $lte: ['$inventory.quantity', '$inventory.lowStockThreshold'] },
        status: 'published'
      });

      for (const product of lowStockProducts) {
        await KafkaManager.publishInventoryEvent('LOW_STOCK_ALERT', {
          productId: product._id,
          productName: product.name,
          currentStock: product.inventory.quantity,
          threshold: product.inventory.lowStockThreshold
        });
      }

      console.log(`Checked ${lowStockProducts.length} low stock products`);
    } catch (error) {
      console.error('Error checking low stock products:', error);
    }
  }
}

module.exports = new InventoryWorker();