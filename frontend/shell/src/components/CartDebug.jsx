import React from 'react';
import { useSelector } from 'react-redux';

const CartDebug = () => {
  const cart = useSelector(state => state.cart);
  
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }
  
  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      backgroundColor: '#f0f0f0',
      padding: '10px',
      borderRadius: '4px',
      fontSize: '12px',
      maxWidth: '200px',
      zIndex: 1000,
      border: '1px solid #ccc'
    }}>
      <strong>Cart Debug:</strong>
      <div>Items: {cart.count}</div>
      <div>Total: ₹{cart.total?.toFixed(2)}</div>
      <div>Products: {cart.items?.length}</div>
    </div>
  );
};

export default CartDebug;