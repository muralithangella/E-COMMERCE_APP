import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { Link } from 'react-router-dom';
import styles from './Header.module.css';

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

           
            {isAuthenticated && user ? (
              <div onClick={handleLogout} style={{ cursor: 'pointer' }}>
                <div style={{ fontSize: '12px', color: '#ccc' }}>Hello, {user.name}</div>
                <div style={{ fontSize: '14px', fontWeight: 'bold' }}>Sign Out</div>
              </div>
            ) : (
              <a href="/login" style={{ color: 'white', textDecoration: 'none' }}>
                <div style={{ fontSize: '12px', color: '#ccc' }}>Hello, sign in</div>
                <div style={{ fontSize: '14px', fontWeight: 'bold' }}>Account & Lists</div>
              </a>
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
            <Link to="/" style={{ color: 'white', textDecoration: 'none', fontSize: '14px', padding: '4px 8px' }}>Fresh</Link>
            <Link to="/products" style={{ color: 'white', textDecoration: 'none', fontSize: '14px', padding: '4px 8px' }}>MX Player</Link>
            <Link to="/products" style={{ color: 'white', textDecoration: 'none', fontSize: '14px', padding: '4px 8px' }}>Sell</Link>
            <Link to="/products?sort=bestsellers" style={{ color: 'white', textDecoration: 'none', fontSize: '14px', padding: '4px 8px' }}>Bestsellers</Link>
            <Link to="/products?category=mobiles" style={{ color: 'white', textDecoration: 'none', fontSize: '14px', padding: '4px 8px' }}>Mobiles</Link>
            <Link to="/products?sort=deals" style={{ color: 'white', textDecoration: 'none', fontSize: '14px', padding: '4px 8px' }}>Today's Deals</Link>
            <Link to="/products" style={{ color: 'white', textDecoration: 'none', fontSize: '14px', padding: '4px 8px' }}>Customer Service</Link>
            <Link to="/products?filter=prime" style={{ color: 'white', textDecoration: 'none', fontSize: '14px', padding: '4px 8px' }}>Prime</Link>
            <Link to="/products?category=electronics" style={{ color: 'white', textDecoration: 'none', fontSize: '14px', padding: '4px 8px' }}>Electronics</Link>
            <Link to="/products?category=fashion" style={{ color: 'white', textDecoration: 'none', fontSize: '14px', padding: '4px 8px' }}>Fashion</Link>
            <Link to="/products?category=home" style={{ color: 'white', textDecoration: 'none', fontSize: '14px', padding: '4px 8px' }}>Home & Kitchen</Link>
            <Link to="/products?category=books" style={{ color: 'white', textDecoration: 'none', fontSize: '14px', padding: '4px 8px' }}>Books</Link>
          </div>
        </div>
      </header>
      

    </>
  );
};

export default Header;