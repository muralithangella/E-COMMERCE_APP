import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';

const Header = () => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { count: cartCount } = useSelector(state => state.cart);

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

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <>
      {/* Main Header */}
      <header style={{
        backgroundColor: '#131921',
        color: 'white',
        padding: '0'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          padding: '8px 16px',
          maxWidth: '1500px',
          margin: '0 auto'
        }}>
          {/* Logo */}
          <a href="/" style={{
            color: 'white',
            textDecoration: 'none',
            marginRight: '20px',
            fontSize: '24px',
            fontWeight: 'bold',
            padding: '8px'
          }}>
            <span style={{ color: '#ff9f00' }}>amazon</span>.in
          </a>

          {/* Location */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            marginRight: '20px',
            padding: '8px',
            cursor: 'pointer',
            borderRadius: '2px'
          }}>
            <div style={{ marginRight: '8px' }}>📍</div>
            <div>
              <div style={{ fontSize: '12px', color: '#ccc' }}>Delivering to</div>
              <div style={{ fontSize: '14px', fontWeight: 'bold' }}>Bengaluru 562130</div>
            </div>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} style={{
            flex: 1,
            display: 'flex',
            maxWidth: '600px',
            marginRight: '20px'
          }}>
            <select style={{
              backgroundColor: '#f3f3f3',
              border: 'none',
              padding: '10px',
              borderRadius: '4px 0 0 4px',
              fontSize: '12px',
              color: '#333',
              minWidth: '50px'
            }}>
              <option>All</option>
            </select>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Amazon.in"
              style={{
                flex: 1,
                padding: '10px',
                border: 'none',
                fontSize: '16px',
                outline: 'none'
              }}
            />
            <button type="submit" style={{
              backgroundColor: '#febd69',
              border: 'none',
              padding: '10px 16px',
              borderRadius: '0 4px 4px 0',
              cursor: 'pointer'
            }}>
              🔍
            </button>
          </form>

          {/* Language */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            marginRight: '20px',
            padding: '8px',
            cursor: 'pointer'
          }}>
            <span style={{ marginRight: '4px' }}>🇮🇳</span>
            <span style={{ fontSize: '14px', fontWeight: 'bold' }}>EN</span>
          </div>

          {/* Account & Lists */}
          <div style={{
            marginRight: '20px',
            padding: '8px',
            cursor: 'pointer'
          }}>
            {isAuthenticated ? (
              <div onClick={handleLogout}>
                <div style={{ fontSize: '12px', color: '#ccc' }}>Hello, {user?.name}</div>
                <div style={{ fontSize: '14px', fontWeight: 'bold' }}>Account & Lists</div>
              </div>
            ) : (
              <div onClick={() => setShowLoginForm(true)}>
                <div style={{ fontSize: '12px', color: '#ccc' }}>Hello, sign in</div>
                <div style={{ fontSize: '14px', fontWeight: 'bold' }}>Account & Lists</div>
              </div>
            )}
          </div>

          {/* Returns & Orders */}
          <div style={{
            marginRight: '20px',
            padding: '8px',
            cursor: 'pointer'
          }}>
            <div style={{ fontSize: '12px', color: '#ccc' }}>Returns</div>
            <div style={{ fontSize: '14px', fontWeight: 'bold' }}>& Orders</div>
          </div>

          {/* Cart */}
          <a href="/cart" style={{
            color: 'white',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            padding: '8px',
            position: 'relative'
          }}>
            <div style={{ fontSize: '24px', marginRight: '8px' }}>🛒</div>
            <div>
              <div style={{ fontSize: '12px', color: '#ccc' }}>Cart</div>
              <div style={{ fontSize: '16px', fontWeight: 'bold' }}>{cartCount}</div>
            </div>
          </a>
        </div>

        {/* Navigation Bar */}
        <div style={{
          backgroundColor: '#232f3e',
          padding: '8px 16px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            maxWidth: '1500px',
            margin: '0 auto',
            gap: '20px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
              padding: '4px 8px'
            }}>
              <span style={{ marginRight: '4px' }}>☰</span>
              <span style={{ fontSize: '14px', fontWeight: 'bold' }}>All</span>
            </div>
            <a href="/" style={{ color: 'white', textDecoration: 'none', fontSize: '14px', padding: '4px 8px' }}>Fresh</a>
            <a href="/products" style={{ color: 'white', textDecoration: 'none', fontSize: '14px', padding: '4px 8px' }}>MX Player</a>
            <a href="/products" style={{ color: 'white', textDecoration: 'none', fontSize: '14px', padding: '4px 8px' }}>Sell</a>
            <a href="/products" style={{ color: 'white', textDecoration: 'none', fontSize: '14px', padding: '4px 8px' }}>Bestsellers</a>
            <a href="/products" style={{ color: 'white', textDecoration: 'none', fontSize: '14px', padding: '4px 8px' }}>Mobiles</a>
            <a href="/products" style={{ color: 'white', textDecoration: 'none', fontSize: '14px', padding: '4px 8px' }}>Today's Deals</a>
            <a href="/products" style={{ color: 'white', textDecoration: 'none', fontSize: '14px', padding: '4px 8px' }}>Customer Service</a>
            <a href="/products" style={{ color: 'white', textDecoration: 'none', fontSize: '14px', padding: '4px 8px' }}>Prime</a>
            <a href="/products" style={{ color: 'white', textDecoration: 'none', fontSize: '14px', padding: '4px 8px' }}>Electronics</a>
            <a href="/products" style={{ color: 'white', textDecoration: 'none', fontSize: '14px', padding: '4px 8px' }}>Fashion</a>
            <a href="/products" style={{ color: 'white', textDecoration: 'none', fontSize: '14px', padding: '4px 8px' }}>Home & Kitchen</a>
            <a href="/products" style={{ color: 'white', textDecoration: 'none', fontSize: '14px', padding: '4px 8px' }}>Books</a>
          </div>
        </div>
      </header>
      
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
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '8px',
            width: '350px',
            maxWidth: '90vw',
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
            border: '1px solid #ddd'
          }}>
            <h2 style={{ margin: '0 0 1rem 0', fontSize: '28px', fontWeight: '400' }}>Sign in</h2>
            
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
                  toast.error('Login failed');
                }
              } catch (error) {
                toast.error('Login error');
              }
            }}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '13px', fontWeight: 'bold' }}>Email or mobile phone number</label>
                <input
                  name="email"
                  type="email"
                  defaultValue="admin@example.com"
                  required
                  style={{ 
                    width: '100%', 
                    padding: '8px', 
                    border: '1px solid #a6a6a6', 
                    borderRadius: '3px',
                    fontSize: '13px',
                    outline: 'none'
                  }}
                />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '13px', fontWeight: 'bold' }}>Password</label>
                <input
                  name="password"
                  type="password"
                  defaultValue="admin123"
                  required
                  style={{ 
                    width: '100%', 
                    padding: '8px', 
                    border: '1px solid #a6a6a6', 
                    borderRadius: '3px',
                    fontSize: '13px',
                    outline: 'none'
                  }}
                />
              </div>
              
              <button
                type="submit"
                style={{
                  width: '100%',
                  padding: '8px',
                  backgroundColor: '#f0c14b',
                  border: '1px solid #a88734',
                  borderRadius: '3px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  marginBottom: '1rem'
                }}
              >
                Sign in
              </button>
              
              <button
                type="button"
                onClick={() => setShowLoginForm(false)}
                style={{
                  width: '100%',
                  padding: '8px',
                  backgroundColor: '#fff',
                  border: '1px solid #d5d9d9',
                  borderRadius: '3px',
                  cursor: 'pointer',
                  fontSize: '13px'
                }}
              >
                Cancel
              </button>
            </form>
            
            <div style={{
              marginTop: '1rem',
              padding: '1rem',
              backgroundColor: '#f3f3f3',
              borderRadius: '4px',
              fontSize: '11px'
            }}>
              <strong>Demo Credentials:</strong><br/>
              Email: admin@example.com<br/>
              Password: admin123
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;