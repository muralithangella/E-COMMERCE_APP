import React, { useState, useEffect } from 'react';

const SimpleCart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCart = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/cart?t=${Date.now()}`);
      if (response.ok) {
        const data = await response.json();
        console.log('Cart data received:', data);
        setCartItems(data.items || []);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (productId) => {
    try {
      await fetch(`http://localhost:5000/api/cart/${productId}`, {
        method: 'DELETE'
      });
      fetchCart(); // Refresh cart
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const clearCart = async () => {
    try {
      await fetch('http://localhost:5000/api/cart/clear', {
        method: 'DELETE'
      });
      fetchCart(); // Refresh cart
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  if (loading) return <div>Loading cart...</div>;

  const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Shopping Cart ({totalItems} items)</h1>
      
      {cartItems.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <>
          {cartItems.map((item, index) => (
            <div key={item.productId || index} style={{
              display: 'flex',
              alignItems: 'center',
              padding: '15px',
              border: '1px solid #ddd',
              borderRadius: '8px',
              marginBottom: '10px',
              backgroundColor: '#fff'
            }}>
              <img 
                src={item.image || 'https://via.placeholder.com/100x100'} 
                alt={item.name || 'Product'}
                style={{ width: '100px', height: '100px', objectFit: 'cover', marginRight: '15px' }}
              />
              
              <div style={{ flex: 1 }}>
                <h4 style={{ margin: '0 0 5px 0' }}>
                  {item.name || `Product ${item.productId || 'Unknown'}`}
                </h4>
                <p style={{ margin: '0', color: '#666' }}>Category: {item.category || 'N/A'}</p>
                <div style={{ display: 'flex', alignItems: 'center', margin: '10px 0' }}>
                  <button style={{ padding: '5px 10px', margin: '0 5px' }}>-</button>
                  <span>{item.quantity}</span>
                  <button style={{ padding: '5px 10px', margin: '0 5px' }}>+</button>
                </div>
                <p style={{ margin: '5px 0 0 0', fontSize: '18px', fontWeight: 'bold' }}>
                  ${(item.price || 0).toFixed(2)} each
                </p>
              </div>
              
              <div style={{ textAlign: 'right' }}>
                <p style={{ margin: '0 0 10px 0', fontSize: '20px', fontWeight: 'bold' }}>
                  ${((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                </p>
                <button 
                  onClick={() => removeItem(item.productId)}
                  style={{
                    backgroundColor: '#dc3545',
                    color: 'white',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
          
          <div style={{ 
            marginTop: '20px', 
            padding: '20px', 
            backgroundColor: '#f8f9fa', 
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <button 
              onClick={clearCart}
              style={{
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '4px',
                cursor: 'pointer',
                marginRight: '10px'
              }}
            >
              Clear Cart
            </button>
            <h3>Total: ${totalPrice.toFixed(2)}</h3>
            <button 
              style={{
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                padding: '15px 30px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default SimpleCart;