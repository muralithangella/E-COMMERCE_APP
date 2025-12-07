import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

export class OrderService {
  static async createOrder(orderData) {
    try {
      const response = await axios.post(`${API_BASE_URL}/orders`, orderData);
      return response.data;
    } catch (error) {
      console.error('OrderService.createOrder error:', error);
      throw error;
    }
  }

  static async getOrders() {
    try {
      const response = await axios.get(`${API_BASE_URL}/orders`);
      return response.data;
    } catch (error) {
      console.error('OrderService.getOrders error:', error);
      throw error;
    }
  }

  static async getOrder(orderId) {
    try {
      const response = await axios.get(`${API_BASE_URL}/orders/${orderId}`);
      return response.data;
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