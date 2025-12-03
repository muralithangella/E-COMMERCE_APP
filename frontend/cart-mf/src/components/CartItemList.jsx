import React from 'react'
import SimpleCartItem from './SimpleCartItem'

const CartItemList = ({ items }) => {
  return (
    <div className="cart-item-list">
      {items.map((item, index) => (
        <SimpleCartItem key={item.productId || index} item={item} />
      ))}
    </div>
  )
}

export default CartItemList