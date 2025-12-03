import React from 'react'

const ErrorMessage = ({ message }) => {
  return (
    <div className="error-message">
      <div className="error-content">
        <h3>Error</h3>
        <p>{message}</p>
      </div>
    </div>
  )
}

export default ErrorMessage