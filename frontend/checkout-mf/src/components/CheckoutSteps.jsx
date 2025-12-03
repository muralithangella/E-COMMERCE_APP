import React from 'react'

const CheckoutSteps = ({ currentStep }) => {
  const steps = [
    { number: 1, title: 'Shipping', icon: '📦' },
    { number: 2, title: 'Payment', icon: '💳' },
    { number: 3, title: 'Review', icon: '✓' }
  ]

  return (
    <div className="checkout-steps">
      {steps.map((step, index) => (
        <div key={step.number} className={`step ${currentStep >= step.number ? 'active' : ''} ${currentStep > step.number ? 'completed' : ''}`}>
          <div className="step-icon">
            {currentStep > step.number ? '✓' : step.icon}
          </div>
          <div className="step-title">{step.title}</div>
          {index < steps.length - 1 && <div className="step-connector"></div>}
        </div>
      ))}
    </div>
  )
}

export default CheckoutSteps