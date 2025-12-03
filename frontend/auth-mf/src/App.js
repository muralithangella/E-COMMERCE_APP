import React, { useState } from 'react';
import { Provider, useSelector, useDispatch } from 'react-redux';
import { store } from './store/store';
import { useLoginMutation, useRegisterMutation } from './services/authApi';
import { setCredentials, logout } from './store/authSlice';
import Toast from './components/Toast';

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [toast, setToast] = useState(null);

  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const [loginMutation, { isLoading: loginLoading }] = useLoginMutation();
  const [registerMutation, { isLoading: registerLoading }] = useRegisterMutation();

  const loading = loginLoading || registerLoading;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      if (isLogin) {
        const result = await loginMutation({
          email: formData.email,
          password: formData.password
        }).unwrap();
        
        dispatch(setCredentials(result));
        setToast({ message: 'Login successful!', type: 'success' });
      } else {
        const result = await registerMutation({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password
        }).unwrap();
        
        setToast({ message: 'Registration successful!', type: 'success' });
        setIsLogin(true);
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          password: '',
          confirmPassword: ''
        });
      }
    } catch (error) {
      console.error('Auth error:', error);
      const errorMessage = error.data?.message || 'Authentication failed';
      setError(errorMessage);
      setToast({ message: errorMessage, type: 'error' });
    }
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Show logged in state
  if (isAuthenticated) {
    return (
      <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px', textAlign: 'center' }}>
        <h2>Welcome, {user?.firstName || user?.email}!</h2>
        <p>You are successfully logged in.</p>
        <button 
          onClick={handleLogout}
          style={{ 
            padding: '10px 20px', 
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Logout
        </button>
        
        <div style={{ marginTop: '30px', textAlign: 'left' }}>
          <h3>Products</h3>
          <div style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '4px' }}>
            <div style={{ marginBottom: '10px', padding: '10px', background: '#f8f9fa' }}>
              <strong>Laptop Pro</strong> - $1,299.99
              <br />
              <small>High-performance laptop for professionals</small>
            </div>
            <div style={{ marginBottom: '10px', padding: '10px', background: '#f8f9fa' }}>
              <strong>Wireless Headphones</strong> - $199.99
              <br />
              <small>Premium noise-canceling headphones</small>
            </div>
            <div style={{ marginBottom: '10px', padding: '10px', background: '#f8f9fa' }}>
              <strong>Smart Watch</strong> - $299.99
              <br />
              <small>Advanced fitness and health tracking</small>
            </div>
            <div style={{ marginTop: '15px', fontWeight: 'bold', textAlign: 'right' }}>
              Total Products: 3 | Total Value: $1,799.97
            </div>
          </div>
        </div>
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px' }}>
      <h2>{isLogin ? 'Login' : 'Register'}</h2>
      
      {error && (
        <div style={{ color: 'red', marginBottom: '10px', padding: '10px', background: '#ffebee', borderRadius: '4px' }}>
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <>
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleInputChange}
              style={{ width: '100%', padding: '10px', margin: '5px 0', boxSizing: 'border-box' }}
              required
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleInputChange}
              style={{ width: '100%', padding: '10px', margin: '5px 0', boxSizing: 'border-box' }}
              required
            />
          </>
        )}
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleInputChange}
          style={{ width: '100%', padding: '10px', margin: '5px 0', boxSizing: 'border-box' }}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleInputChange}
          style={{ width: '100%', padding: '10px', margin: '5px 0', boxSizing: 'border-box' }}
          required
        />
        {!isLogin && (
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            style={{ width: '100%', padding: '10px', margin: '5px 0', boxSizing: 'border-box' }}
            required
          />
        )}
        <button 
          type="submit" 
          disabled={loading}
          style={{ 
            width: '100%', 
            padding: '10px', 
            margin: '10px 0', 
            backgroundColor: loading ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Please wait...' : (isLogin ? 'Login' : 'Register')}
        </button>
      </form>
      <p style={{ textAlign: 'center', marginTop: '20px' }}>
        {isLogin ? "Don't have an account? " : "Already have an account? "}
        <button 
          type="button" 
          onClick={() => setIsLogin(!isLogin)}
          style={{ background: 'none', border: 'none', color: 'blue', cursor: 'pointer', textDecoration: 'underline' }}
        >
          {isLogin ? 'Register' : 'Login'}
        </button>
      </p>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

const App = () => {
  return (
    <Provider store={store}>
      <AuthForm />
    </Provider>
  );
};

export default App;