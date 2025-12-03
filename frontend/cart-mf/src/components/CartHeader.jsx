import React from 'react'
import { useSelector } from 'react-redux'

const CartHeader = () => {
  const { itemCount } = useSelector((state) => state.cart)

  return (
    <div className="cart-header">
      <h1>Shopping Cart</h1>
      <p className="item-count">
        {itemCount} {itemCount === 1 ? 'item' : 'items'}
      </p>
    </div>
  )
}

export default CartHeader