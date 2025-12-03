import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider, useDispatch } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { baseApi } from '../shared/services/baseApi';
import authReducer, { setCredentials } from '../shared/store/authSlice';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import LoginPage from './pages/LoginPage';
import Toast from '../shared/components/Toast';
import { useToast } from '../shared/hooks/useToast';

const store = configureStore({
  reducer: {
    auth: authReducer,
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
});

const AppContent = () => {
  const { toasts } = useToast();
  const dispatch = useDispatch();

  // Restore authentication on app load
  React.useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (token && user) {
      try {
        const parsedUser = JSON.parse(user);
        dispatch(setCredentials({ accessToken: token, user: parsedUser }));
        console.log('Authentication restored for:', parsedUser.email);
      } catch (error) {
        console.error('Failed to restore authentication:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  }, [dispatch]);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f3f3f3' }}>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<div>Register Page</div>} />
          <Route path="*" element={<div style={{padding: '2rem', backgroundColor: 'red', color: 'white'}}><h1>404 - Route not found</h1><p>Path: {window.location.pathname}</p></div>} />
        </Routes>
      </main>
      
      {/* Toast Notifications */}
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={() => {}}
        />
      ))}
    </div>
  );
};

const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <AppContent />
      </Router>
    </Provider>
  );
};

export default App;