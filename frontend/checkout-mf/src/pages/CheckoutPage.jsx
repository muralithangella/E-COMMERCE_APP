import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCreateOrderMutation } from '../../../shared/services/ordersApi'
import { useToast } from '../../../shared/hooks/useToast'
import CheckoutSteps from '../components/CheckoutSteps'
import ShippingForm from '../components/ShippingForm'
import PaymentForm from '../components/PaymentForm'
import OrderSummary from '../components/OrderSummary'

const CheckoutPage = () => {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)
  const [createOrder, { isLoading, error }] = useCreateOrderMutation()
  const { showToast } = useToast()

  const handleStepChange = (step) => {
    setCurrentStep(step)
  }

  const handlePlaceOrder = async () => {
    try {
      const orderResult = await createOrder().unwrap()
      showToast('Order placed successfully!', 'success')
      navigate(`/confirmation/${orderResult.orderId}`)
    } catch (error) {
      showToast('Order failed. Please try again.', 'error')
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
        {error && <div className="error-message">{error.message}</div>}
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