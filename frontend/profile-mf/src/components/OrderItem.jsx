import React from 'react'

const OrderItem = ({ order }) => {
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'status-pending'
      case 'processing': return 'status-processing'
      case 'shipped': return 'status-shipped'
      case 'delivered': return 'status-delivered'
      case 'cancelled': return 'status-cancelled'
      default: return 'status-default'
    }
  }

  return (
    <div className="order-item">
      <div className="order-header">
        <div className="order-info">
          <h3>Order #{order.orderNumber || order._id.slice(-8)}</h3>
          <p className="order-date">
            {new Date(order.createdAt).toLocaleDateString()}
          </p>
        </div>
        <div className="order-status">
          <span className={`status ${getStatusColor(order.status)}`}>
            {order.status}
          </span>
        </div>
      </div>
      
      <div className="order-details">
        <div className="order-items">
          {order.items?.map((item, index) => (
            <div key={index} className="order-product">
              <img 
                src={item.product?.image || '/placeholder.png'} 
                alt={item.product?.name}
                className="product-image"
              />
              <div className="product-info">
                <p className="product-name">{item.product?.name}</p>
                <p className="product-details">
                  Qty: {item.quantity} × ${item.price}
                </p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="order-summary">
          <div className="order-total">
            <strong>Total: ${order.totalAmount}</strong>
          </div>
          {order.shippingAddress && (
            <div className="shipping-address">
              <p><strong>Shipped to:</strong></p>
              <p>{order.shippingAddress.street}</p>
              <p>{order.shippingAddress.city}, {order.shippingAddress.state}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default OrderItem