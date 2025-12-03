import React, { useState, useEffect } from 'react';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const loadCartItems = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/cart');
        if (response.ok) {
          const data = await response.json();
          setCartItems(data.items || []);
        }
      } catch (error) {
        console.error('Error loading cart:', error);
        setCartItems([]);
      }
    };

    loadCartItems();
  }, []);

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeItem(productId);
      return;
    }
    
    const updatedCart = cartItems.map(item =>
      item.id === productId ? { ...item, quantity: newQuantity } : item
    );
    setCartItems(updatedCart);
    localStorage.setItem('cartItems', JSON.stringify(updatedCart));
  };

  const removeItem = (productId) => {
    const updatedCart = cartItems.filter(item => item.id !== productId);
    setCartItems(updatedCart);
    localStorage.setItem('cartItems', JSON.stringify(updatedCart));
  };

  const clearCart = async () => {
    try {
      await fetch('http://localhost:5000/api/cart/clear', { method: 'DELETE' });
      setCartItems([]);
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  const totalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  if (cartItems.length === 0) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>Shopping Cart</h2>
        <p style={{ fontSize: '18px', color: '#666', margin: '40px 0' }}>Your cart is empty</p>
        <a href="/products" style={{ 
          color: '#007bff', 
          textDecoration: 'none',
          fontSize: '16px'
        }}>
          Continue Shopping
        </a>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>Shopping Cart ({totalItems} items)</h2>
      
      <div style={{ marginTop: '20px' }}>
        {cartItems.map(item => (
          <div key={item.id} style={{
            display: 'flex',
            alignItems: 'center',
            padding: '20px',
            border: '1px solid #ddd',
            borderRadius: '8px',
            marginBottom: '15px',
            backgroundColor: '#fff'
          }}>
            <img 
              src={item.image} 
              alt={item.name}
              style={{ 
                width: '80px', 
                height: '80px', 
                objectFit: 'cover', 
                borderRadius: '4px',
                marginRight: '15px'
              }}
            />
            
            <div style={{ flex: 1 }}>
              <h4 style={{ margin: '0 0 5px 0' }}>{item.name}</h4>
              <p style={{ color: '#666', margin: '0 0 10px 0', fontSize: '14px' }}>
                {item.description}
              </p>
              <p style={{ color: '#888', margin: '0', fontSize: '12px' }}>
                Category: {item.category}
              </p>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button 
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                style={{
                  width: '30px',
                  height: '30px',
                  border: '1px solid #ddd',
                  background: '#f8f9fa',
                  cursor: 'pointer',
                  borderRadius: '4px'
                }}
              >
                -
              </button>
              
              <span style={{ 
                minWidth: '40px', 
                textAlign: 'center',
                fontSize: '16px',
                fontWeight: 'bold'
              }}>
                {item.quantity}
              </span>
              
              <button 
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                style={{
                  width: '30px',
                  height: '30px',
                  border: '1px solid #ddd',
                  background: '#f8f9fa',
                  cursor: 'pointer',
                  borderRadius: '4px'
                }}
              >
                +
              </button>
            </div>
            
            <div style={{ 
              minWidth: '80px', 
              textAlign: 'right',
              marginLeft: '15px'
            }}>
              <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#007bff' }}>
                ${(item.price * item.quantity).toFixed(2)}
              </div>
              <div style={{ fontSize: '12px', color: '#666' }}>
                ${item.price} each
              </div>
            </div>
            
            <button 
              onClick={() => removeItem(item.id)}
              style={{
                marginLeft: '15px',
                padding: '5px 10px',
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              Remove
            </button>
          </div>
        ))}
      </div>
      
      <div style={{
        marginTop: '30px',
        padding: '20px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <button 
            onClick={clearCart}
            style={{
              padding: '10px 20px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Clear Cart
          </button>
        </div>
        
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '10px' }}>
            Total: ${totalAmount.toFixed(2)}
          </div>
          <a
            href="/checkout"
            style={{
              display: 'inline-block',
              padding: '12px 30px',
              backgroundColor: '#28a745',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '4px',
              fontSize: '16px',
              fontWeight: 'bold'
            }}
          >
            Proceed to Checkout
          </a>
        </div>
      </div>
    </div>
  );
};

export default CartPage;