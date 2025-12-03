import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import HomePage from './pages/HomePage.jsx'
import ProductsPage from './pages/ProductsPage.jsx'
import AuthPage from './pages/AuthPage.jsx'
import CartPage from './pages/CartPage.jsx'
import CheckoutPage from './pages/CheckoutPage.jsx'
import OrderConfirmationPage from './pages/OrderConfirmationPage.jsx'
import ProfilePage from './pages/ProfilePage.jsx'
import './styles/App.css'

function App() {
  return (
     <Router>
    <div className="app">
      <Header />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products/*" element={<ProductsPage />} />
          <Route path="/auth" element={<AuthPage />} />
       {/*    <Route path="/auth/*" element={<AuthPage />} /> */}
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout/*" element={<CheckoutPage />} />
          <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
          <Route path="/profile/*" element={<ProfilePage />} />
        </Routes>
      </main>
      <Footer />
    </div>
    </Router>
  )
}

export default App