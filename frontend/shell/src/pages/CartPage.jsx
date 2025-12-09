import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { updateQuantity, removeFromCart } from '../store/slices/cartSlice';
import styles from './CartPage.module.css';

const CartPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items, total, count } = useSelector(state => state.cart);

  const handleQuantityChange = useCallback((itemId, newQuantity) => {
    if (newQuantity <= 0) {
      dispatch(removeFromCart(itemId));
    } else {
      dispatch(updateQuantity({ id: itemId, quantity: newQuantity }));
    }
  }, [dispatch]);

  const handleRemoveItem = useCallback((itemId) => {
    dispatch(removeFromCart(itemId));
  }, [dispatch]);

  const handleCheckout = useCallback(() => {
    navigate('/checkout');
  }, [navigate]);

  const handleContinueShopping = useCallback(() => {
    navigate('/products');
  }, [navigate]);

  const handleClearCart = useCallback(() => {
    dispatch({ type: 'cart/clearCart' });
    localStorage.removeItem('cart');
  }, [dispatch]);

  if (!items?.length) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', backgroundColor: 'white', margin: '20px', borderRadius: '8px' }}>
        <h2>Your cart is empty</h2>
        <p>Add some products to get started!</p>
        <button 
          onClick={handleContinueShopping}
          style={{
            padding: '12px 24px',
            backgroundColor: '#ff9f00',
            color: 'black',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold'
          }}
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#f3f3f3', minHeight: '100vh', padding: '20px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h1 style={{ margin: 0 }}>Shopping Cart ({count} items)</h1>
          <button onClick={handleClearCart} style={{ padding: '8px 16px', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Clear Cart</button>
        </div>
        
        <div style={{ display: 'flex', gap: '20px' }}>
          <div style={{ flex: 2 }}>
            {items.map((item) => (
              <div key={item.id} style={{
                backgroundColor: 'white',
                padding: '20px',
                marginBottom: '16px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '16px'
              }}>
                <img 
                  src={item.images?.[0]?.url || item.image || 'https://via.placeholder.com/100x100/F0F0F0/999999?text=Product'} 
                  alt={item.name} 
                  style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '4px' }}
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/100x100/F0F0F0/999999?text=Product'; }}
                />
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: '0 0 8px 0', fontSize: '16px' }}>{item.name}</h3>
                  <p style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: 'bold', color: '#B12704' }}>₹{item.price}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <button 
                      onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                      style={{ padding: '4px 8px', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer' }}
                    >
                      -
                    </button>
                    <span style={{ padding: '4px 12px', border: '1px solid #ddd', borderRadius: '4px' }}>
                      {item.quantity}
                    </span>
                    <button 
                      onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      style={{ padding: '4px 8px', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer' }}
                    >
                      +
                    </button>
                    <button 
                      onClick={() => handleRemoveItem(item.id)}
                      style={{ marginLeft: '20px', color: '#0066c0', background: 'none', border: 'none', cursor: 'pointer' }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
                <div style={{ fontSize: '18px', fontWeight: 'bold' }}>
                  ₹{(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
          
          <div style={{ flex: 1 }}>
            <div style={{
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '8px',
              position: 'sticky',
              top: '20px'
            }}>
              <h3 style={{ margin: '0 0 16px 0' }}>Order Summary</h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span>Subtotal ({count} items):</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span>Shipping:</span>
                <span>{total > 499 ? 'FREE' : '₹40'}</span>
              </div>
              <hr style={{ margin: '16px 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: 'bold', marginBottom: '20px' }}>
                <span>Total:</span>
                <span>₹{(total + (total > 499 ? 0 : 40)).toFixed(2)}</span>
              </div>
              <button
                onClick={handleCheckout}
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: '#ff9f00',
                  color: 'black',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  marginBottom: '12px'
                }}
              >
                Proceed to Checkout
              </button>
              <button
                onClick={handleContinueShopping}
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: 'white',
                  color: '#0066c0',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '16px'
                }}
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;