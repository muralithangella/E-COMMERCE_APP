import React, { useState, useEffect, useCallback } from 'react';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const CartItem = ({ item, onUpdateQuantity, onRemove }) => (
  <div style={{
    display: 'flex',
    padding: '20px 0',
    borderBottom: '1px solid #ddd',
    gap: '16px'
  }}>
    <img 
      src={item.image} 
      alt={item.name}
      style={{
        width: '180px',
        height: '180px',
        objectFit: 'cover',
        borderRadius: '4px'
      }}
      onError={(e) => {
        e.target.src = `https://via.placeholder.com/180x180/f0f0f0/666666?text=${encodeURIComponent(item.name.substring(0, 10))}`;
      }}
    />
    <div style={{ flex: 1 }}>
      <h3 style={{
        margin: '0 0 8px 0',
        fontSize: '18px',
        fontWeight: 'normal',
        color: '#0066c0',
        lineHeight: '1.3'
      }}>{item.name}</h3>
      <div style={{ color: '#007600', fontSize: '14px', marginBottom: '8px' }}>In stock</div>
      <div style={{ fontSize: '12px', color: '#666', marginBottom: '16px' }}>Eligible for FREE Shipping</div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '14px' }}>Qty:</span>
          <select 
            value={item.quantity}
            onChange={(e) => onUpdateQuantity(item.id, parseInt(e.target.value))}
            style={{
              padding: '4px 8px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              backgroundColor: '#f0f2f2'
            }}
          >
            {[...Array(10)].map((_, i) => (
              <option key={i + 1} value={i + 1}>{i + 1}</option>
            ))}
          </select>
        </div>
        <button 
          onClick={() => onRemove(item.id)}
          style={{
            background: 'none',
            border: 'none',
            color: '#0066c0',
            fontSize: '14px',
            cursor: 'pointer',
            textDecoration: 'underline'
          }}
        >
          Delete
        </button>
        <button style={{
          background: 'none',
          border: 'none',
          color: '#0066c0',
          fontSize: '14px',
          cursor: 'pointer',
          textDecoration: 'underline'
        }}>
          Save for later
        </button>
      </div>
    </div>
    <div style={{ textAlign: 'right' }}>
      <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#0f1111' }}>
        ₹{(item.price * item.quantity).toFixed(2)}
      </div>
    </div>
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
      setCart(data.data || data);
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

  if (loading) return (
    <div style={{ 
      backgroundColor: '#eaeded', 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center' 
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '18px', marginBottom: '10px' }}>Loading your cart...</div>
        <div style={{ color: '#666' }}>Please wait</div>
      </div>
    </div>
  );

  return (
    <div style={{ backgroundColor: '#eaeded', minHeight: '100vh', padding: '20px 0' }}>
      <div style={{ maxWidth: '1500px', margin: '0 auto', padding: '0 20px' }}>
        <div style={{ display: 'flex', gap: '20px' }}>
          {/* Main cart content */}
          <div style={{ flex: 1 }}>
            <div style={{
              backgroundColor: 'white',
              borderRadius: '8px',
              padding: '20px'
            }}>
              <h1 style={{ 
                margin: '0 0 20px 0', 
                fontSize: '28px', 
                fontWeight: 'normal',
                borderBottom: '1px solid #ddd',
                paddingBottom: '20px'
              }}>
                Shopping Cart
              </h1>
              
              {cart.items.length === 0 ? (
                <div style={{
                  textAlign: 'center',
                  padding: '60px 20px',
                  color: '#666'
                }}>
                  <div style={{ fontSize: '18px', marginBottom: '16px' }}>Your Amazon Cart is empty</div>
                  <a href="/products" style={{
                    color: '#0066c0',
                    textDecoration: 'none',
                    fontSize: '14px'
                  }}>Shop today's deals</a>
                </div>
              ) : (
                <div>
                  <div style={{ marginBottom: '20px', fontSize: '14px', color: '#666' }}>
                    Price
                  </div>
                  {cart.items.map(item => (
                    <CartItem
                      key={item.id}
                      item={item}
                      onUpdateQuantity={updateQuantity}
                      onRemove={removeItem}
                    />
                  ))}
                  
                  <div style={{
                    textAlign: 'right',
                    padding: '20px 0',
                    borderTop: '1px solid #ddd',
                    marginTop: '20px'
                  }}>
                    <div style={{ fontSize: '18px', fontWeight: 'normal' }}>
                      Subtotal ({cart.totalItems} items): <span style={{ fontWeight: 'bold' }}>₹{cart.totalPrice.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          {cart.items.length > 0 && (
            <div style={{ width: '300px' }}>
              <div style={{
                backgroundColor: 'white',
                borderRadius: '8px',
                padding: '20px'
              }}>
                <div style={{ marginBottom: '16px', fontSize: '18px' }}>
                  Subtotal ({cart.totalItems} items): <span style={{ fontWeight: 'bold' }}>₹{cart.totalPrice.toFixed(2)}</span>
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', fontSize: '12px' }}>
                    <input type="checkbox" style={{ marginRight: '8px' }} />
                    This order contains a gift
                  </label>
                </div>
                <button style={{
                  width: '100%',
                  backgroundColor: '#ff9f00',
                  border: '1px solid #e47911',
                  borderRadius: '8px',
                  padding: '8px 16px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  marginBottom: '12px'
                }}>
                  Proceed to Buy
                </button>
                <button 
                  onClick={clearCart}
                  style={{
                    width: '100%',
                    backgroundColor: 'white',
                    border: '1px solid #d5d9d9',
                    borderRadius: '8px',
                    padding: '8px 16px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    color: '#0f1111'
                  }}
                >
                  Clear Cart
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;