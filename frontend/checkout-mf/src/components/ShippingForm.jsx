import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { updateShippingAddress, updateBillingAddress, toggleSameAddress } from '../store/checkoutSlice'
import AddressForm from './AddressForm'

const ShippingForm = ({ onNext }) => {
  const dispatch = useDispatch()
  const { shippingAddress, billingAddress, useSameAddress } = useSelector(state => state.checkout)

  const handleShippingChange = (field, value) => {
    dispatch(updateShippingAddress({ [field]: value }))
    if (useSameAddress) {
      dispatch(updateBillingAddress({ [field]: value }))
    }
  }

  const handleBillingChange = (field, value) => {
    dispatch(updateBillingAddress({ [field]: value }))
  }

  const handleSameAddressToggle = () => {
    dispatch(toggleSameAddress())
  }

  const isFormValid = () => {
    const required = ['firstName', 'lastName', 'address', 'city', 'state', 'zipCode', 'country']
    const shippingValid = required.every(field => shippingAddress[field]?.trim())
    const billingValid = useSameAddress || required.every(field => billingAddress[field]?.trim())
    return shippingValid && billingValid
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (isFormValid()) {
      onNext()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="shipping-form">
      <h2>Shipping Address</h2>
      <AddressForm
        address={shippingAddress}
        onChange={handleShippingChange}
      />

      <div className="same-address-checkbox">
        <label>
          <input
            type="checkbox"
            checked={useSameAddress}
            onChange={handleSameAddressToggle}
          />
          Use same address for billing
        </label>
      </div>

      {!useSameAddress && (
        <>
          <h2>Billing Address</h2>
          <AddressForm
            address={billingAddress}
            onChange={handleBillingChange}
          />
        </>
      )}

      <div className="form-actions">
        <button type="submit" disabled={!isFormValid()} className="next-btn">
          Continue to Payment
        </button>
      </div>
    </form>
  )
}

export default ShippingForm