export class OrderService {
  static async createOrder(orderData) {
    try {
      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });
      if (!response.ok) throw new Error('Failed to create order');
      return await response.json();
    } catch (error) {
      console.error('OrderService.createOrder error:', error);
      throw error;
    }
  }

  static async getOrders() {
    try {
      const response = await fetch('http://localhost:5000/api/orders');
      if (!response.ok) throw new Error('Failed to get orders');
      return await response.json();
    } catch (error) {
      console.error('OrderService.getOrders error:', error);
      throw error;
    }
  }

  static async getOrder(orderId) {
    try {
      const response = await fetch(`http://localhost:5000/api/orders/${orderId}`);
      if (!response.ok) throw new Error('Failed to get order');
      return await response.json();
    } catch (error) {
      console.error('OrderService.getOrder error:', error);
      throw error;
    }
  }

  static generateOrderId() {
    return `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  }

  static calculateOrderTotals(items) {
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal > 499 ? 0 : 40;
    const tax = subtotal * 0.08;
    const total = subtotal + shipping + tax;
    
    return { subtotal, shipping, tax, total };
  }

  static getEstimatedDeliveryDate(days = 7) {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toISOString();
  }
}

export default OrderService;