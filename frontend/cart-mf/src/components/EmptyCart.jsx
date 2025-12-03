import React from 'react'

const EmptyCart = () => {
  const handleContinueShopping = () => {
    window.dispatchEvent(new CustomEvent('navigate', { detail: '/products' }))
  }

  return (
    <div className="empty-cart">
      <div className="empty-cart-content">
        <h2>Your cart is empty</h2>
        <p>Add some products to get started!</p>
        <button className="continue-shopping-btn" onClick={handleContinueShopping}>
          Continue Shopping
        </button>
      </div>
    </div>
  )
}

export default EmptyCart