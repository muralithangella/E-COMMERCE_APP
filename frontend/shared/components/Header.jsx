import React, { useState } from 'react';

const Header = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const cartItemsCount = 0; // Will be updated with real cart data

  // Check authentication status from localStorage
  React.useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      
      console.log('Header auth check - token:', !!token, 'userData:', !!userData);
      
      if (token && userData) {
        try {
          const parsedUser = JSON.parse(userData);
          console.log('Setting user:', parsedUser);
          setUser(parsedUser);
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Failed to parse user data:', error);
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
    
    // Listen for storage changes
    window.addEventListener('storage', checkAuth);
    
    // Also check periodically in case of same-tab changes
    const interval = setInterval(checkAuth, 1000);
    
    return () => {
      window.removeEventListener('storage', checkAuth);
      clearInterval(interval);
    };
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(searchTerm)}`;
    }
  };

  return (
    <header style={{
      backgroundColor: '#232f3e',
      color: 'white',
      padding: '0',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      {/* Top Bar */}
      <div style={{
        backgroundColor: '#131921',
        padding: '8px 0',
        fontSize: '13px'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0 20px'
        }}>
          <div style={{ display: 'flex', gap: '20px' }}>
            <span>📍 Deliver to India</span>
          </div>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            {isAuthenticated ? (
              <>
                <span>Hello, {user?.name || 'User'}</span>
                <a href="/orders" style={{ color: 'white', textDecoration: 'none' }}>
                  Returns & Orders
                </a>
                <button
                  onClick={() => {
                    localStorage.clear();
                    window.location.href = '/';
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '13px'
                  }}
                >
                  Sign Out
                </button>
              </>
            ) : (
              <a href="/login" style={{ color: 'white', textDecoration: 'none' }}>
                Hello, Sign in
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div style={{
        padding: '12px 0',
        backgroundColor: '#232f3e'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
          padding: '0 20px'
        }}>
          {/* Logo */}
          <a
            href="/"
            style={{
              color: 'white',
              textDecoration: 'none',
              fontSize: '24px',
              fontWeight: 'bold',
              minWidth: '120px'
            }}
          >
            🛒 E-Shop
          </a>

          {/* Search Bar */}
          <form
            onSubmit={handleSearch}
            style={{
              flex: 1,
              display: 'flex',
              maxWidth: '600px'
            }}
          >
            <select
              style={{
                padding: '8px 12px',
                border: 'none',
                borderRadius: '4px 0 0 4px',
                backgroundColor: '#f3f3f3',
                fontSize: '14px',
                minWidth: '60px'
              }}
            >
              <option>All</option>
              <option>Electronics</option>
              <option>Fashion</option>
              <option>Home</option>
            </select>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search products..."
              style={{
                flex: 1,
                padding: '8px 12px',
                border: 'none',
                fontSize: '16px',
                outline: 'none'
              }}
            />
            <button
              type="submit"
              style={{
                padding: '8px 16px',
                border: 'none',
                borderRadius: '0 4px 4px 0',
                backgroundColor: '#ff9f00',
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              🔍
            </button>
          </form>

          {/* Right Side */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            {/* Language */}
            <div style={{ fontSize: '14px' }}>
              🌐 EN
            </div>

            {/* Account */}
            {isAuthenticated ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <div style={{
                  color: 'white',
                  fontSize: '14px',
                  textAlign: 'right'
                }}>
                  <div style={{ fontSize: '12px' }}>Welcome back,</div>
                  <div style={{ fontWeight: 'bold' }}>{user?.name}</div>
                </div>
                <button
                  onClick={() => {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    window.location.href = '/';
                  }}
                  style={{
                    background: '#ff9f00',
                    border: 'none',
                    color: '#000',
                    padding: '8px 16px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 'bold'
                  }}
                >
                  Logout
                </button>
              </div>
            ) : (
              <a
                href="/login"
                style={{
                  color: 'white',
                  textDecoration: 'none',
                  fontSize: '14px',
                  textAlign: 'center'
                }}
              >
                <div style={{ fontSize: '12px' }}>Hello, sign in</div>
                <div style={{ fontWeight: 'bold' }}>Account & Lists</div>
              </a>
            )}

            {/* Orders */}
            <a
              href="/orders"
              style={{
                color: 'white',
                textDecoration: 'none',
                fontSize: '14px',
                textAlign: 'center'
              }}
            >
              <div style={{ fontSize: '12px' }}>Returns</div>
              <div style={{ fontWeight: 'bold' }}>& Orders</div>
            </a>

            {/* Cart */}
            <a
              href="/cart"
              style={{
                color: 'white',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                position: 'relative'
              }}
            >
              <div style={{ position: 'relative' }}>
                <span style={{ fontSize: '24px' }}>🛒</span>
                {cartItemsCount > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: '-8px',
                    right: '-8px',
                    backgroundColor: '#ff4757',
                    color: 'white',
                    borderRadius: '50%',
                    width: '20px',
                    height: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}>
                    {cartItemsCount}
                  </span>
                )}
              </div>
              <div style={{ fontSize: '14px', fontWeight: 'bold' }}>
                Cart
              </div>
            </a>
          </div>
        </div>
      </div>

      {/* Navigation Bar */}
      <div style={{
        backgroundColor: '#37475a',
        padding: '8px 0'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          gap: '30px',
          padding: '0 20px'
        }}>
          <a href="/products" style={{ color: 'white', textDecoration: 'none', fontSize: '14px' }}>
            All Products
          </a>
          <a href="/products?category=electronics" style={{ color: 'white', textDecoration: 'none', fontSize: '14px' }}>
            Electronics
          </a>
          <a href="/products?category=fashion" style={{ color: 'white', textDecoration: 'none', fontSize: '14px' }}>
            Fashion
          </a>
          <a href="/products?category=home" style={{ color: 'white', textDecoration: 'none', fontSize: '14px' }}>
            Home & Kitchen
          </a>
          <a href="/deals" style={{ color: 'white', textDecoration: 'none', fontSize: '14px' }}>
            Today's Deals
          </a>
          <a href="/prime" style={{ color: 'white', textDecoration: 'none', fontSize: '14px' }}>
            Prime
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;