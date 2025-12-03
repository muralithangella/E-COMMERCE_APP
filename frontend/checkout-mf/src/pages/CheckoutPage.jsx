import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import CheckoutSteps from '../components/CheckoutSteps'
import ShippingForm from '../components/ShippingForm'
import PaymentForm from '../components/PaymentForm'
import OrderSummary from '../components/OrderSummary'
import { setCurrentStep, processPayment, createOrder } from '../store/checkoutSlice'

const CheckoutPage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { currentStep, isLoading, error, orderId } = useSelector(state => state.checkout)

  const handleStepChange = (step) => {
    dispatch(setCurrentStep(step))
  }

  const handlePlaceOrder = async () => {
    try {
      const orderResult = await dispatch(createOrder()).unwrap()
      navigate(`/confirmation/${orderResult.orderId}`)
    } catch (error) {
      console.error('Order failed:', error)
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <ShippingForm onNext={() => handleStepChange(2)} />
      case 2:
        return <PaymentForm onNext={() => handleStepChange(3)} onBack={() => handleStepChange(1)} />
      case 3:
        return (
          <div className="review-step">
            <h3>Review Your Order</h3>
            <OrderSummary />
            <div className="checkout-actions">
              <button onClick={() => handleStepChange(2)} disabled={isLoading}>
                Back to Payment
              </button>
              <button onClick={handlePlaceOrder} disabled={isLoading} className="place-order-btn">
                {isLoading ? 'Processing...' : 'Place Order'}
              </button>
            </div>
          </div>
        )
      default:
        return <ShippingForm onNext={() => handleStepChange(2)} />
    }
  }

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <h1>Checkout</h1>
        <CheckoutSteps currentStep={currentStep} />
        {error && <div className="error-message">{error}</div>}
        <div className="checkout-content">
          <div className="checkout-form">
            {renderStepContent()}
          </div>
          <div className="checkout-sidebar">
            <OrderSummary />
          </div>
        </div>
      </div>
    </div>
  )
}

export default CheckoutPage