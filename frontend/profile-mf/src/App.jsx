import React from 'react'
import { Routes, Route } from 'react-router-dom'
import ProfilePage from './pages/ProfilePage'
import EditProfilePage from './pages/EditProfilePage'
import OrderHistoryPage from './pages/OrderHistoryPage'
import './styles/App.css'

function App() {
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<ProfilePage />} />
        <Route path="/edit" element={<EditProfilePage />} />
        <Route path="/orders" element={<OrderHistoryPage />} />
      </Routes>
    </div>
  )
}

export default App