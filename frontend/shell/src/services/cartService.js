import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

export class CartService {
  static async addToCart(productId, quantity = 1) {
    try {
      const response = await axios.post(`${API_BASE_URL}/cart/add`, {
        productId,
        quantity
      });
      return response.data;
    } catch (error) {
      console.error('CartService.addToCart error:', error);
      throw error;
    }
  }

  static async getCart() {
    try {
      const response = await axios.get(`${API_BASE_URL}/cart`);
      return response.data;
    } catch (error) {
      console.error('CartService.getCart error:', error);
      throw error;
    }
  }

  static async updateCartItem(itemId, quantity) {
    try {
      const response = await axios.put(`${API_BASE_URL}/cart/items/${itemId}`, {
        quantity
      });
      return response.data;
    } catch (error) {
      console.error('CartService.updateCartItem error:', error);
      throw error;
    }
  }

  static async removeFromCart(itemId) {
    try {
      const response = await axios.delete(`${API_BASE_URL}/cart/items/${itemId}`);
      return response.data;
    } catch (error) {
      console.error('CartService.removeFromCart error:', error);
      throw error;
    }
  }

  static calculateTotals(items) {
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal > 499 ? 0 : 40;
    const tax = subtotal * 0.08;
    const total = subtotal + shipping + tax;
    
    return { subtotal, shipping, tax, total };
  }
}

export default CartService;