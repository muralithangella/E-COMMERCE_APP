import React, { useState, useEffect } from 'react';

const Header = () => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      
      if (token && userData) {
        try {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
          setIsAuthenticated(true);
        } catch (error) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
          setIsAuthenticated(false);
        }
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    };

    checkAuth();
    const interval = setInterval(checkAuth, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
    window.location.href = '/';
  };

  return (
    <header style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1rem 2rem',
      backgroundColor: '#333',
      color: 'white'
    }}>
      <h1>E-Commerce Shell</h1>
      <nav style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <a href="/" style={{ color: 'white', textDecoration: 'none' }}>Home</a>
        <a href="/products" style={{ color: 'white', textDecoration: 'none' }}>Products</a>
        <a href="/cart" style={{ color: 'white', textDecoration: 'none' }}>Cart</a>
        
        {isAuthenticated ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span>Welcome, {user?.name}</span>
            <button 
              onClick={handleLogout}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#ff4444',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Logout
            </button>
          </div>
        ) : (
          <button 
            onClick={() => setShowLoginForm(!showLoginForm)}
            style={{ 
              color: 'white', 
              background: 'none', 
              border: 'none', 
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            Login
          </button>
        )}
      </nav>
      
      {/* Login Form Modal */}
      {showLoginForm && !isAuthenticated && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          backdropFilter: 'blur(5px)'
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '0',
            borderRadius: '12px',
            width: '420px',
            maxWidth: '90vw',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
            overflow: 'hidden',
            animation: 'slideIn 0.3s ease-out'
          }}>
            {/* Header */}
            <div style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              padding: '2rem',
              textAlign: 'center',
              color: 'white'
            }}>
              <h2 style={{ margin: 0, fontSize: '28px', fontWeight: '300' }}>Welcome Back</h2>
              <p style={{ margin: '0.5rem 0 0 0', opacity: 0.9, fontSize: '14px' }}>Sign in to your account</p>
            </div>
            
            {/* Form */}
            <div style={{ padding: '2rem' }}>
              <form onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                const email = formData.get('email');
                const password = formData.get('password');
                
                try {
                  const response = await fetch('http://localhost:5000/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                  });
                  
                  if (response.ok) {
                    const data = await response.json();
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('user', JSON.stringify(data.user));
                    setShowLoginForm(false);
                    window.location.reload();
                  } else {
                    alert('Login failed');
                  }
                } catch (error) {
                  alert('Login error');
                }
              }}>
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: '#555', fontSize: '14px', fontWeight: '500' }}>Email Address</label>
                  <input
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    defaultValue="admin@example.com"
                    required
                    style={{ 
                      width: '100%', 
                      padding: '12px 16px', 
                      border: '2px solid #e1e5e9', 
                      borderRadius: '8px',
                      fontSize: '16px',
                      transition: 'border-color 0.3s ease',
                      outline: 'none'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#667eea'}
                    onBlur={(e) => e.target.style.borderColor = '#e1e5e9'}
                  />
                </div>
                <div style={{ marginBottom: '2rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: '#555', fontSize: '14px', fontWeight: '500' }}>Password</label>
                  <input
                    name="password"
                    type="password"
                    placeholder="Enter your password"
                    defaultValue="admin123"
                    required
                    style={{ 
                      width: '100%', 
                      padding: '12px 16px', 
                      border: '2px solid #e1e5e9', 
                      borderRadius: '8px',
                      fontSize: '16px',
                      transition: 'border-color 0.3s ease',
                      outline: 'none'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#667eea'}
                    onBlur={(e) => e.target.style.borderColor = '#e1e5e9'}
                  />
                </div>
                
                <button
                  type="submit"
                  style={{
                    width: '100%',
                    padding: '14px',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontWeight: '600',
                    marginBottom: '1rem',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  Sign In
                </button>
                
                <button
                  type="button"
                  onClick={() => setShowLoginForm(false)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    backgroundColor: 'transparent',
                    color: '#6c757d',
                    border: '2px solid #e1e5e9',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#f8f9fa';
                    e.target.style.borderColor = '#6c757d';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'transparent';
                    e.target.style.borderColor = '#e1e5e9';
                  }}
                >
                  Cancel
                </button>
              </form>
              
              {/* Demo Credentials */}
              <div style={{
                marginTop: '1.5rem',
                padding: '1rem',
                backgroundColor: '#f8f9fa',
                borderRadius: '8px',
                border: '1px solid #e9ecef'
              }}>
                <p style={{ margin: '0 0 0.5rem 0', fontSize: '12px', color: '#6c757d', fontWeight: '600' }}>Demo Credentials:</p>
                <p style={{ margin: 0, fontSize: '12px', color: '#495057' }}>Email: admin@example.com</p>
                <p style={{ margin: 0, fontSize: '12px', color: '#495057' }}>Password: admin123</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;