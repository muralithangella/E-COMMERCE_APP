import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { clearCart } from '../store/cartSlice'

const CartSummary = () => {
  const dispatch = useDispatch()
  const { total, itemCount } = useSelector((state) => state.cart)

  const handleClearCart = async () => {
    try {
      await fetch('http://localhost:5000/api/cart/clear', {
        method: 'DELETE'
      });
      localStorage.removeItem('cart');
      localStorage.removeItem('persist:cart');
      dispatch(clearCart());
      window.location.reload();
    } catch (error) {
      console.error('Failed to clear cart:', error);
    }
  }

  const handleCheckout = () => {
    // Navigate to checkout - this would be handled by the shell app
    window.dispatchEvent(new CustomEvent('navigate', { detail: '/checkout' }))
  }

  return (
    <div className="cart-summary">
      <h3>Order Summary</h3>
      <div className="summary-line">
        <span>Items ({itemCount}):</span>
        <span>${total.toFixed(2)}</span>
      </div>
      <div className="summary-line total">
        <span>Total:</span>
        <span>${total.toFixed(2)}</span>
      </div>
      <div className="summary-actions">
        <button className="checkout-btn" onClick={handleCheckout}>
          Proceed to Checkout
        </button>
        <button className="clear-btn" onClick={handleClearCart}>
          Clear Cart
        </button>
      </div>
    </div>
  )
}

export default CartSummary