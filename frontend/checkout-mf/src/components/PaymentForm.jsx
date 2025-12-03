import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { updatePaymentMethod } from '../store/checkoutSlice'

const PaymentForm = ({ onNext, onBack }) => {
  const dispatch = useDispatch()
  const { paymentMethod } = useSelector(state => state.checkout)
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    dispatch(updatePaymentMethod({ [name]: value }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!paymentMethod.cardholderName?.trim()) {
      newErrors.cardholderName = 'Cardholder name is required'
    }
    
    if (!paymentMethod.cardNumber?.replace(/\s/g, '')) {
      newErrors.cardNumber = 'Card number is required'
    } else if (paymentMethod.cardNumber.replace(/\s/g, '').length < 16) {
      newErrors.cardNumber = 'Invalid card number'
    }
    
    if (!paymentMethod.expiryDate) {
      newErrors.expiryDate = 'Expiry date is required'
    }
    
    if (!paymentMethod.cvv) {
      newErrors.cvv = 'CVV is required'
    } else if (paymentMethod.cvv.length < 3) {
      newErrors.cvv = 'Invalid CVV'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    const matches = v.match(/\d{4,16}/g)
    const match = matches && matches[0] || ''
    const parts = []
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    if (parts.length) {
      return parts.join(' ')
    } else {
      return v
    }
  }

  const formatExpiryDate = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4)
    }
    return v
  }

  const handleCardNumberChange = (e) => {
    const formatted = formatCardNumber(e.target.value)
    dispatch(updatePaymentMethod({ cardNumber: formatted }))
  }

  const handleExpiryChange = (e) => {
    const formatted = formatExpiryDate(e.target.value)
    dispatch(updatePaymentMethod({ expiryDate: formatted }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validateForm()) {
      onNext()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="payment-form">
      <h2>Payment Information</h2>
      
      <div className="payment-methods">
        <label className="payment-method-option">
          <input
            type="radio"
            name="type"
            value="card"
            checked={paymentMethod.type === 'card'}
            onChange={handleChange}
          />
          Credit/Debit Card
        </label>
      </div>

      <div className="card-form">
        <div className="form-group">
          <label htmlFor="cardholderName">Cardholder Name *</label>
          <input
            type="text"
            id="cardholderName"
            name="cardholderName"
            value={paymentMethod.cardholderName}
            onChange={handleChange}
            className={errors.cardholderName ? 'error' : ''}
          />
          {errors.cardholderName && <span className="error-text">{errors.cardholderName}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="cardNumber">Card Number *</label>
          <input
            type="text"
            id="cardNumber"
            name="cardNumber"
            value={paymentMethod.cardNumber}
            onChange={handleCardNumberChange}
            placeholder="1234 5678 9012 3456"
            maxLength="19"
            className={errors.cardNumber ? 'error' : ''}
          />
          {errors.cardNumber && <span className="error-text">{errors.cardNumber}</span>}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="expiryDate">Expiry Date *</label>
            <input
              type="text"
              id="expiryDate"
              name="expiryDate"
              value={paymentMethod.expiryDate}
              onChange={handleExpiryChange}
              placeholder="MM/YY"
              maxLength="5"
              className={errors.expiryDate ? 'error' : ''}
            />
            {errors.expiryDate && <span className="error-text">{errors.expiryDate}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="cvv">CVV *</label>
            <input
              type="text"
              id="cvv"
              name="cvv"
              value={paymentMethod.cvv}
              onChange={handleChange}
              placeholder="123"
              maxLength="4"
              className={errors.cvv ? 'error' : ''}
            />
            {errors.cvv && <span className="error-text">{errors.cvv}</span>}
          </div>
        </div>
      </div>

      <div className="form-actions">
        <button type="button" onClick={onBack} className="back-btn">
          Back to Shipping
        </button>
        <button type="submit" className="next-btn">
          Review Order
        </button>
      </div>
    </form>
  )
}

export default PaymentForm