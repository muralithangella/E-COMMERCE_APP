import React from 'react'
import { useDispatch } from 'react-redux'
import { clearError } from '../store/cartSlice'

const ErrorMessage = ({ message }) => {
  const dispatch = useDispatch()

  const handleRetry = () => {
    dispatch(clearError())
    window.location.reload()
  }

  return (
    <div className="error-message">
      <h3>Something went wrong</h3>
      <p>{message}</p>
      <button onClick={handleRetry}>Try Again</button>
    </div>
  )
}

export default ErrorMessage