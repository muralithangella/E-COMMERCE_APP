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
        console.log('Individual items:', data.items);
        setCartItems(data.items || []);
      } else {
        // Fallback to mock data when authentication fails
        const mockItems = [
          {
            productId: '1',
            name: 'Wireless Headphones',
            price: 99.99,
            quantity: 1,
            category: 'Electronics',
            image: 'https://via.placeholder.com/100x100?text=Headphones'
          },
          {
            productId: '2', 
            name: 'Running Shoes',
            price: 129.99,
            quantity: 1,
            category: 'Sports',
            image: 'https://via.placeholder.com/100x100?text=Shoes'
          }
        ];
        setCartItems(mockItems);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
      // Fallback to mock data on error
      const mockItems = [
        {
          productId: '1',
          name: 'Wireless Headphones', 
          price: 99.99,
          quantity: 1,
          category: 'Electronics',
          image: 'https://via.placeholder.com/100x100?text=Headphones'
        },
        {
          productId: '2',
          name: 'Running Shoes',
          price: 129.99, 
          quantity: 1,
          category: 'Sports',
          image: 'https://via.placeholder.com/100x100?text=Shoes'
        }
      ];
      setCartItems(mockItems);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return;
    
    const updatedItems = cartItems.map(item => 
      item.productId === productId ? { ...item, quantity: newQuantity } : item
    );
    setCartItems(updatedItems);
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
      fetchCart();
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  const cleanupCart = async () => {
    try {
      await fetch('http://localhost:5000/api/cart/cleanup', {
        method: 'DELETE'
      });
      fetchCart();
    } catch (error) {
      console.error('Error cleaning cart:', error);
    }
  };

  const addSampleProducts = async () => {
    const products = [
      { productId: 'prod-1', name: 'Wireless Headphones', price: 99.99, quantity: 1 },
      { productId: 'prod-2', name: 'Running Shoes', price: 129.99, quantity: 1 }
    ];
    
    for (const product of products) {
      try {
        await fetch('http://localhost:5000/api/cart/add', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(product)
        });
      } catch (error) {
        console.error('Error adding product:', error);
      }
    }
    fetchCart();
  };

  useEffect(() => {
    fetchCart();
  }, []);

  if (loading) return <div>Loading cart...</div>;

  const totalPrice = cartItems.reduce((sum, item) => {
    const price = item.price || item.product?.price || 0;
    return sum + (price * item.quantity);
  }, 0);
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
                  {item.name || `Product ${item.productId}`}
                </h4>
                <p style={{ margin: '0', color: '#666' }}>Category: {item.category || ''}</p>
                <div style={{ display: 'flex', alignItems: 'center', margin: '10px 0' }}>
                  <button 
                    onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                    style={{ 
                      padding: '5px 10px', 
                      margin: '0 5px',
                      backgroundColor: item.quantity <= 1 ? '#ccc' : '#007bff',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: item.quantity <= 1 ? 'not-allowed' : 'pointer'
                    }}
                  >
                    -
                  </button>
                  <span style={{ margin: '0 10px', minWidth: '20px', textAlign: 'center' }}>
                    {item.quantity}
                  </span>
                  <button 
                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                    style={{ 
                      padding: '5px 10px', 
                      margin: '0 5px',
                      backgroundColor: '#007bff',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    +
                  </button>
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
              onClick={async () => {
                await fetch('http://localhost:5000/api/cart/clear', { method: 'DELETE' });
                setCartItems([]);
              }}
              style={{
                backgroundColor: '#dc3545',
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
            <button 
              onClick={addSampleProducts}
              style={{
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '4px',
                cursor: 'pointer',
                marginRight: '10px'
              }}
            >
              Add Sample Products
            </button>
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