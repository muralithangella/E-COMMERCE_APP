import React, { useState, useEffect, useCallback } from 'react';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const CartItem = ({ item, onUpdateQuantity, onRemove }) => (
  <div className="cart-item">
    <img src={item.image} alt={item.name} />
    <div className="item-details">
      <h4>{item.name}</h4>
      <p className="price">${item.price}</p>
    </div>
    <div className="quantity-controls">
      <button 
        onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
        disabled={item.quantity <= 1}
      >
        -
      </button>
      <span>{item.quantity}</span>
      <button onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}>
        +
      </button>
    </div>
    <div className="item-total">
      ${(item.price * item.quantity).toFixed(2)}
    </div>
    <button onClick={() => onRemove(item.id)} className="remove-btn">
      Remove
    </button>
  </div>
);

const App = () => {
  const [cart, setCart] = useState({ items: [], totalItems: 0, totalPrice: 0 });
  const [loading, setLoading] = useState(true);

  const fetchCart = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/api/cart`);
      if (!response.ok) throw new Error('Failed to fetch cart');
      
      const data = await response.json();
      setCart(data);
    } catch (err) {
      console.error('Error fetching cart:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateQuantity = useCallback(async (itemId, quantity) => {
    try {
      const response = await fetch(`${API_BASE}/api/cart/items/${itemId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity })
      });
      
      if (!response.ok) throw new Error('Failed to update quantity');
      fetchCart();
    } catch (err) {
      console.error('Error updating quantity:', err);
    }
  }, [fetchCart]);

  const removeItem = useCallback(async (itemId) => {
    try {
      const response = await fetch(`${API_BASE}/api/cart/items/${itemId}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) throw new Error('Failed to remove item');
      fetchCart();
    } catch (err) {
      console.error('Error removing item:', err);
    }
  }, [fetchCart]);

  const clearCart = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE}/api/cart/clear`, {
        method: 'DELETE'
      });
      
      if (!response.ok) throw new Error('Failed to clear cart');
      fetchCart();
    } catch (err) {
      console.error('Error clearing cart:', err);
    }
  }, [fetchCart]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  if (loading) return <div className="loading">Loading cart...</div>;

  return (
    <div className="cart-container">
      <h1>Shopping Cart ({cart.totalItems} items)</h1>
      
      {cart.items.length === 0 ? (
        <div className="empty-cart">Your cart is empty</div>
      ) : (
        <>
          <div className="cart-items">
            {cart.items.map(item => (
              <CartItem
                key={item.id}
                item={item}
                onUpdateQuantity={updateQuantity}
                onRemove={removeItem}
              />
            ))}
          </div>
          
          <div className="cart-summary">
            <button onClick={clearCart} className="clear-btn">
              Clear Cart
            </button>
            <div className="total">
              Total: ${cart.totalPrice.toFixed(2)}
            </div>
            <button className="checkout-btn">
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default App;