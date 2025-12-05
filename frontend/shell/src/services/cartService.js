export class CartService {
  static async addToCart(productId, quantity = 1) {
    try {
      const response = await fetch('http://localhost:5000/api/cart/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity })
      });
      if (!response.ok) throw new Error('Failed to add to cart');
      return await response.json();
    } catch (error) {
      console.error('CartService.addToCart error:', error);
      throw error;
    }
  }

  static async getCart() {
    try {
      const response = await fetch('http://localhost:5000/api/cart');
      if (!response.ok) throw new Error('Failed to get cart');
      return await response.json();
    } catch (error) {
      console.error('CartService.getCart error:', error);
      throw error;
    }
  }

  static async updateCartItem(itemId, quantity) {
    try {
      const response = await fetch(`http://localhost:5000/api/cart/items/${itemId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity })
      });
      if (!response.ok) throw new Error('Failed to update cart item');
      return await response.json();
    } catch (error) {
      console.error('CartService.updateCartItem error:', error);
      throw error;
    }
  }

  static async removeFromCart(itemId) {
    try {
      const response = await fetch(`http://localhost:5000/api/cart/items/${itemId}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to remove from cart');
      return await response.json();
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