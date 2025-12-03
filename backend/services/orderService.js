const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const KafkaManager = require('../config/kafka');
const InventoryService = require('./inventoryService');

class OrderService {
  async createOrder(orderData, userId) {
    try {
      const orderNumber = this.generateOrderNumber();
      
      // Calculate pricing
      const pricing = await this.calculatePricing(orderData.items, orderData.couponCode);
      
      const order = new Order({
        ...orderData,
        orderNumber,
        customer: userId,
        pricing
      });

      await order.save();

      // Reserve inventory
      await InventoryService.reserveStock(orderData.items, order._id);

      // Clear cart
      await Cart.findOneAndUpdate(
        { user: userId },
        { items: [], totalItems: 0, totalPrice: 0 }
      );

      await KafkaManager.publishOrderEvent('ORDER_CREATED', {
        orderId: order._id,
        orderNumber: order.orderNumber,
        customerId: userId,
        total: pricing.total
      });

      return order;
    } catch (error) {
      console.error('Order creation failed:', error);
      throw error;
    }
  }

  async updateOrderStatus(orderId, status, trackingInfo = null) {
    try {
      const updateData = { status };
      
      if (status === 'shipped' && trackingInfo) {
        updateData.tracking = {
          ...trackingInfo,
          shippedAt: new Date()
        };
      }
      
      if (status === 'delivered') {
        updateData['tracking.deliveredAt'] = new Date();
      }

      const order = await Order.findByIdAndUpdate(orderId, updateData, { new: true });

      await KafkaManager.publishOrderEvent('ORDER_STATUS_UPDATED', {
        orderId: order._id,
        orderNumber: order.orderNumber,
        status,
        trackingInfo
      });

      return order;
    } catch (error) {
      console.error('Order status update failed:', error);
      throw error;
    }
  }

  async cancelOrder(orderId, userId) {
    try {
      const order = await Order.findOne({ _id: orderId, customer: userId });
      
      if (!order) {
        throw new Error('Order not found');
      }

      if (!['pending', 'confirmed'].includes(order.status)) {
        throw new Error('Order cannot be cancelled');
      }

      order.status = 'cancelled';
      await order.save();

      // Release reserved stock
      await InventoryService.releaseStock(order.items, orderId);

      await KafkaManager.publishOrderEvent('ORDER_CANCELLED', {
        orderId: order._id,
        orderNumber: order.orderNumber,
        customerId: userId
      });

      return order;
    } catch (error) {
      console.error('Order cancellation failed:', error);
      throw error;
    }
  }

  async calculatePricing(items, couponCode = null) {
    let subtotal = 0;

    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        throw new Error(`Product ${item.product} not found`);
      }
      
      const price = product.price.sale || product.price.regular;
      subtotal += price * item.quantity;
      item.price = price;
    }

    let discount = 0;
    if (couponCode) {
      discount = await this.applyCoupon(couponCode, subtotal, items);
    }

    const tax = subtotal * 0.08; // 8% tax
    const shipping = subtotal > 50 ? 0 : 10; // Free shipping over $50
    const total = subtotal + tax + shipping - discount;

    return {
      subtotal,
      tax: Math.round(tax * 100) / 100,
      shipping,
      discount,
      total: Math.round(total * 100) / 100
    };
  }

  async applyCoupon(couponCode, subtotal, items) {
    const Coupon = require('../models/Coupon');
    
    const coupon = await Coupon.findOne({
      code: couponCode.toUpperCase(),
      isActive: true,
      validFrom: { $lte: new Date() },
      validUntil: { $gte: new Date() }
    });

    if (!coupon) {
      throw new Error('Invalid or expired coupon');
    }

    if (coupon.minimumAmount && subtotal < coupon.minimumAmount) {
      throw new Error(`Minimum order amount is $${coupon.minimumAmount}`);
    }

    let discount = 0;
    if (coupon.type === 'percentage') {
      discount = (subtotal * coupon.value) / 100;
      if (coupon.maximumDiscount) {
        discount = Math.min(discount, coupon.maximumDiscount);
      }
    } else if (coupon.type === 'fixed_amount') {
      discount = Math.min(coupon.value, subtotal);
    }

    // Update coupon usage
    coupon.usageCount += 1;
    await coupon.save();

    return discount;
  }

  generateOrderNumber() {
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substr(2, 5).toUpperCase();
    return `ORD-${timestamp.slice(-8)}-${random}`;
  }

  async getOrderAnalytics(startDate, endDate) {
    try {
      const matchStage = {
        createdAt: {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        }
      };

      const [orderStats, revenueStats] = await Promise.all([
        Order.aggregate([
          { $match: matchStage },
          {
            $group: {
              _id: '$status',
              count: { $sum: 1 }
            }
          }
        ]),
        Order.aggregate([
          { $match: { ...matchStage, 'payment.status': 'completed' } },
          {
            $group: {
              _id: null,
              totalRevenue: { $sum: '$pricing.total' },
              averageOrderValue: { $avg: '$pricing.total' },
              totalOrders: { $sum: 1 }
            }
          }
        ])
      ]);

      return {
        orderStats,
        revenueStats: revenueStats[0] || { totalRevenue: 0, averageOrderValue: 0, totalOrders: 0 }
      };
    } catch (error) {
      console.error('Order analytics failed:', error);
      throw error;
    }
  }
}

module.exports = new OrderService();