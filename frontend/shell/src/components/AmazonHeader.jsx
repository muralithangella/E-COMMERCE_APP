import React, { useState, useRef, useEffect } from 'react';
import './AmazonHeader.css';

const AmazonHeader = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [showCartDropdown, setShowCartDropdown] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const searchRef = useRef(null);
  const accountRef = useRef(null);

  // Mock data
  const [cartCount, setCartCount] = useState(3);
  const [user, setUser] = useState({ name: 'Rajesh', isLoggedIn: true });
  const [location, setLocation] = useState({ pincode: '560001', area: 'Bangalore' });

  const categories = [
    'All', 'Mobiles', 'Electronics', 'Fashion', 'Home & Kitchen', 
    'Beauty', 'Books', 'Sports', 'Toys', 'Grocery'
  ];

  const handleSearch = async (query) => {
    if (query.length > 2) {
      // Mock API call
      const mockSuggestions = [
        'iPhone 15 Pro Max',
        'Samsung Galaxy S24',
        'OnePlus 12',
        'Xiaomi 14',
        'Google Pixel 8'
      ].filter(item => item.toLowerCase().includes(query.toLowerCase()));
      
      setSuggestions(mockSuggestions);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery) {
        handleSearch(searchQuery);
      }
    }, 300);
    
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
      if (accountRef.current && !accountRef.current.contains(event.target)) {
        setShowAccountMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      {/* Top Header */}
      <header className="amazon-header">
        <div className="header-top">
          <div className="header-container">
            {/* Logo */}
            <div className="logo-section">
              <a href="/" className="logo">
                <img src="/amazon-logo.png" alt="Amazon" className="logo-img" />
                <span className="logo-text">.in</span>
              </a>
            </div>

            {/* Delivery Location */}
            <div className="delivery-section" onClick={() => setShowLocationModal(true)}>
              <div className="deliver-to">
                <span className="deliver-text">Deliver to</span>
                <div className="location-info">
                  <i className="location-icon">📍</i>
                  <div className="location-text">
                    <span className="location-name">{user.name}</span>
                    <span className="location-area">{location.area} {location.pincode}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Search Bar */}
            <div className="search-section" ref={searchRef}>
              <div className="search-container">
                <select className="search-category">
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search Amazon.in"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => searchQuery && setShowSuggestions(true)}
                />
                <button className="search-button">
                  <i className="search-icon">🔍</i>
                </button>
              </div>
              
              {/* Search Suggestions */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="search-suggestions">
                  {suggestions.map((suggestion, index) => (
                    <div key={index} className="suggestion-item">
                      <i className="suggestion-icon">🔍</i>
                      <span>{suggestion}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Language Selector */}
            <div className="language-section">
              <div className="language-selector">
                <img src="/india-flag.png" alt="IN" className="flag-icon" />
                <span>EN</span>
                <i className="dropdown-arrow">▼</i>
              </div>
            </div>

            {/* Account & Lists */}
            <div className="account-section" ref={accountRef}>
              <div 
                className="account-info"
                onClick={() => setShowAccountMenu(!showAccountMenu)}
              >
                <span className="hello-text">
                  Hello, {user.isLoggedIn ? user.name : 'Sign in'}
                </span>
                <div className="account-lists">
                  <span>Account & Lists</span>
                  <i className="dropdown-arrow">▼</i>
                </div>
              </div>

              {/* Account Dropdown */}
              {showAccountMenu && (
                <div className="account-dropdown">
                  {!user.isLoggedIn ? (
                    <div className="signin-section">
                      <button className="signin-button">Sign In</button>
                      <p>New customer? <a href="/register">Start here.</a></p>
                    </div>
                  ) : (
                    <div className="account-menu">
                      <div className="menu-section">
                        <h4>Your Account</h4>
                        <ul>
                          <li><a href="/account">Your Account</a></li>
                          <li><a href="/orders">Your Orders</a></li>
                          <li><a href="/wishlist">Your Wish List</a></li>
                          <li><a href="/recommendations">Your Recommendations</a></li>
                          <li><a href="/prime">Your Prime Membership</a></li>
                        </ul>
                      </div>
                      <div className="menu-section">
                        <h4>Your Lists</h4>
                        <ul>
                          <li><a href="/lists/create">Create a List</a></li>
                          <li><a href="/lists/find">Find a List or Registry</a></li>
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Returns & Orders */}
            <div className="returns-section">
              <a href="/orders" className="returns-link">
                <span className="returns-text">Returns</span>
                <span className="orders-text">& Orders</span>
              </a>
            </div>

            {/* Prime */}
            <div className="prime-section">
              <a href="/prime" className="prime-link">
                <img src="/prime-logo.png" alt="Prime" className="prime-logo" />
              </a>
            </div>

            {/* Cart */}
            <div className="cart-section">
              <a href="/cart" className="cart-link">
                <div className="cart-icon-container">
                  <i className="cart-icon">🛒</i>
                  {cartCount > 0 && (
                    <span className="cart-count">{cartCount}</span>
                  )}
                </div>
                <span className="cart-text">Cart</span>
              </a>
            </div>
          </div>
        </div>

        {/* Navigation Bar */}
        <div className="nav-bar">
          <div className="nav-container">
            <div className="nav-left">
              <button className="nav-menu-button">
                <i className="menu-icon">☰</i>
                <span>All</span>
              </button>
              
              <nav className="nav-links">
                <a href="/products?category=Mobiles">Mobiles</a>
                <a href="/products?category=Bestsellers">Best Sellers</a>
                <a href="/products?category=Fashion">Fashion</a>
                <a href="/products?category=Electronics">Electronics</a>
                <a href="/products?category=Home & Kitchen">Home & Kitchen</a>
                <a href="/products?category=Prime">Prime</a>
                <a href="/products?category=Today's Deals">Today's Deals</a>
                <a href="/products?category=Books">Books</a>
              </nav>
            </div>

            <div className="nav-right">
              <a href="/products" className="sell-link">Sell</a>
            </div>
          </div>
        </div>
      </header>

      {/* Location Modal */}
      {showLocationModal && (
        <div className="modal-overlay" onClick={() => setShowLocationModal(false)}>
          <div className="location-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Choose your location</h3>
              <button 
                className="modal-close"
                onClick={() => setShowLocationModal(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <p>Delivery options and delivery speeds may vary for different locations</p>
              <div className="location-input">
                <input 
                  type="text" 
                  placeholder="Enter pincode"
                  className="pincode-input"
                />
                <button className="apply-button">Apply</button>
              </div>
              <div className="current-location">
                <button className="detect-location">
                  📍 Use my current location
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AmazonHeader;