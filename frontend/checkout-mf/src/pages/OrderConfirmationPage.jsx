import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useSelector } from 'react-redux'

const OrderConfirmationPage = () => {
  const { orderId } = useParams()
  const [orderDetails, setOrderDetails] = useState(null)
  const { orderSummary } = useSelector(state => state.checkout)

  useEffect(() => {
    // In a real app, fetch order details from API
    setOrderDetails({
      orderId,
      status: 'confirmed',
      estimatedDelivery: '3-5 business days',
      trackingNumber: `TRK${orderId}`,
      ...orderSummary
    })
  }, [orderId, orderSummary])

  if (!orderDetails) {
    return <div className="loading">Loading order details...</div>
  }

  return (
    <div className="confirmation-page">
      <div className="confirmation-container">
        <div className="success-icon">✓</div>
        <h1>Order Confirmed!</h1>
        <p>Thank you for your purchase. Your order has been successfully placed.</p>
        
        <div className="order-details">
          <h2>Order Details</h2>
          <div className="detail-row">
            <span>Order ID:</span>
            <span>{orderDetails.orderId}</span>
          </div>
          <div className="detail-row">
            <span>Status:</span>
            <span className="status-confirmed">{orderDetails.status}</span>
          </div>
          <div className="detail-row">
            <span>Total:</span>
            <span>${orderDetails.total?.toFixed(2)}</span>
          </div>
          <div className="detail-row">
            <span>Estimated Delivery:</span>
            <span>{orderDetails.estimatedDelivery}</span>
          </div>
          <div className="detail-row">
            <span>Tracking Number:</span>
            <span>{orderDetails.trackingNumber}</span>
          </div>
        </div>

        <div className="confirmation-actions">
          <Link to="/" className="continue-shopping-btn">
            Continue Shopping
          </Link>
          <button onClick={() => window.print()} className="print-btn">
            Print Receipt
          </button>
        </div>
      </div>
    </div>
  )
}

export default OrderConfirmationPage