import React from 'react'
import OrderItem from './OrderItem'

const OrderList = ({ orders }) => {
  if (!orders || orders.length === 0) {
    return (
      <div className="order-list-empty">
        <p>No orders found.</p>
      </div>
    )
  }

  return (
    <div className="order-list">
      {orders.map((order) => (
        <OrderItem key={order._id} order={order} />
      ))}
    </div>
  )
}

export default OrderList