import React from 'react'
import { Routes, Route } from 'react-router-dom'
import CheckoutPage from './pages/CheckoutPage'
import OrderConfirmationPage from './pages/OrderConfirmationPage'
import './styles/App.css'

function App() {
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<CheckoutPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/confirmation/:orderId" element={<OrderConfirmationPage />} />
      </Routes>
    </div>
  )
}

export default App