import React from 'react';

const CartSummary = ({ items = [] }) => {
  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="cart-summary">
      <h3>Order Summary</h3>
      <div className="summary-line">
        <span>Subtotal ({items.length} items):</span>
        <span>${total.toFixed(2)}</span>
      </div>
      <div className="summary-line total">
        <span>Total:</span>
        <span>${total.toFixed(2)}</span>
      </div>
      <button className="checkout-btn">Proceed to Checkout</button>
    </div>
  );
};

export default CartSummary;