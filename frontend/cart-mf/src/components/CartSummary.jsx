import React from 'react'
import { useDispatch } from 'react-redux'
import { clearCart } from '../store/cartSlice'

const CartSummary = ({ total = 0, itemCount = 0 }) => {
  const dispatch = useDispatch()

  const handleClearCart = async () => {
    try {
      await dispatch(clearCart()).unwrap()
    } catch (error) {
      console.error('Failed to clear cart:', error)
    }
  }

  const handleCheckout = () => {
    // Navigate to checkout - this would be handled by the shell app
    window.dispatchEvent(new CustomEvent('navigate', { detail: '/checkout' }))
  }

  const shipping = 0 // Free shipping for now
  const tax = total * 0.08 // 8% tax
  const finalTotal = total + shipping + tax

  return (
    <div className="cart-summary">
      <h3>Order Summary</h3>
      <div className="summary-line">
        <span>Items ({itemCount}):</span>
        <span>${total.toFixed(2)}</span>
      </div>
      <div className="summary-line">
        <span>Shipping:</span>
        <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
      </div>
      <div className="summary-line">
        <span>Tax:</span>
        <span>${tax.toFixed(2)}</span>
      </div>
      <div className="summary-line total">
        <span>Total:</span>
        <span>${finalTotal.toFixed(2)}</span>
      </div>
      <div className="summary-actions">
        <button className="checkout-btn" onClick={handleCheckout}>
          Proceed to Checkout (${finalTotal.toFixed(2)})
        </button>
        <button className="clear-btn" onClick={handleClearCart}>
          Clear Cart
        </button>
      </div>
    </div>
  )
}

export default CartSummary