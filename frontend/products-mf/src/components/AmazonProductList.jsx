import React, { useState, useEffect } from 'react';
import './AmazonProductList.css';

const AmazonProductList = ({ category = 'all', searchQuery = '' }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    brand: '',
    minPrice: '',
    maxPrice: '',
    rating: '',
    sort: 'relevance'
  });
  const [showFilters, setShowFilters] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 16,
    total: 0,
    pages: 0
  });

  const sortOptions = [
    { value: 'relevance', label: 'Featured' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Avg. Customer Review' },
    { value: 'newest', label: 'Newest Arrivals' },
    { value: 'popularity', label: 'Popularity' }
  ];

  const priceRanges = [
    { label: 'Under ₹500', min: 0, max: 500 },
    { label: '₹500 - ₹1,000', min: 500, max: 1000 },
    { label: '₹1,000 - ₹5,000', min: 1000, max: 5000 },
    { label: '₹5,000 - ₹10,000', min: 5000, max: 10000 },
    { label: '₹10,000 - ₹25,000', min: 10000, max: 25000 },
    { label: '₹25,000 & Above', min: 25000, max: 999999 }
  ];

  const ratingFilters = [
    { value: '4', label: '4★ & Up' },
    { value: '3', label: '3★ & Up' },
    { value: '2', label: '2★ & Up' },
    { value: '1', label: '1★ & Up' }
  ];

  // Mock brands (would come from API)
  const availableBrands = [
    'Samsung', 'Apple', 'OnePlus', 'Xiaomi', 'Realme', 'Vivo', 'Oppo',
    'Sony', 'LG', 'Panasonic', 'Whirlpool', 'Bosch', 'IFB'
  ];

  useEffect(() => {
    fetchProducts();
  }, [category, searchQuery, filters, pagination.page]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      
      if (category !== 'all') queryParams.append('category', category);
      if (searchQuery) queryParams.append('search', searchQuery);
      if (filters.brand) queryParams.append('brand', filters.brand);
      if (filters.minPrice) queryParams.append('minPrice', filters.minPrice);
      if (filters.maxPrice) queryParams.append('maxPrice', filters.maxPrice);
      if (filters.rating) queryParams.append('rating', filters.rating);
      if (filters.sort) queryParams.append('sort', filters.sort);
      queryParams.append('page', pagination.page);
      queryParams.append('limit', pagination.limit);

      const response = await fetch(`http://localhost:5000/api/products?${queryParams}`);
      const data = await response.json();
      
      if (data.success) {
        setProducts(data.data);
        setPagination(prev => ({
          ...prev,
          total: data.pagination.total,
          pages: data.pagination.pages
        }));
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handlePriceRangeSelect = (min, max) => {
    setFilters(prev => ({
      ...prev,
      minPrice: min,
      maxPrice: max
    }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const clearFilters = () => {
    setFilters({
      brand: '',
      minPrice: '',
      maxPrice: '',
      rating: '',
      sort: 'relevance'
    });
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={i} className="star filled">★</span>);
    }
    
    if (hasHalfStar) {
      stars.push(<span key="half" className="star half">★</span>);
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<span key={`empty-${i}`} className="star empty">★</span>);
    }
    
    return stars;
  };

  const addToCart = async (productId) => {
    try {
      const response = await fetch('http://localhost:5000/api/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'user-id': 'guest'
        },
        body: JSON.stringify({ productId, quantity: 1 })
      });
      
      const data = await response.json();
      if (data.success) {
        console.log('Added to cart successfully');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const addToWishlist = async (productId) => {
    try {
      const response = await fetch('http://localhost:5000/api/wishlist/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'user-id': 'guest'
        },
        body: JSON.stringify({ productId })
      });
      
      const data = await response.json();
      if (data.success) {
        console.log('Added to wishlist successfully');
      }
    } catch (error) {
      console.error('Error adding to wishlist:', error);
    }
  };

  return (
    <div className="amazon-product-list">
      <div className="container">
        {/* Breadcrumb */}
        <div className="breadcrumb">
          <a href="/">Home</a>
          <span className="separator">›</span>
          {category !== 'all' && (
            <>
              <span className="current">{category}</span>
              {searchQuery && (
                <>
                  <span className="separator">›</span>
                  <span className="current">"{searchQuery}"</span>
                </>
              )}
            </>
          )}
          {category === 'all' && searchQuery && (
            <span className="current">Search results for "{searchQuery}"</span>
          )}
        </div>

        <div className="content-wrapper">
          {/* Sidebar Filters */}
          <aside className={`filters-sidebar ${showFilters ? 'show' : ''}`}>
            <div className="filters-header">
              <h3>Filters</h3>
              <button 
                className="clear-filters"
                onClick={clearFilters}
              >
                Clear all
              </button>
            </div>

            {/* Brand Filter */}
            <div className="filter-section">
              <h4>Brand</h4>
              <div className="filter-options">
                {availableBrands.map(brand => (
                  <label key={brand} className="filter-option">
                    <input
                      type="radio"
                      name="brand"
                      value={brand}
                      checked={filters.brand === brand}
                      onChange={(e) => handleFilterChange('brand', e.target.value)}
                    />
                    <span>{brand}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div className="filter-section">
              <h4>Price</h4>
              <div className="filter-options">
                {priceRanges.map((range, index) => (
                  <label key={index} className="filter-option">
                    <input
                      type="radio"
                      name="priceRange"
                      checked={filters.minPrice == range.min && filters.maxPrice == range.max}
                      onChange={() => handlePriceRangeSelect(range.min, range.max)}
                    />
                    <span>{range.label}</span>
                  </label>
                ))}
              </div>
              
              <div className="custom-price-range">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.minPrice}
                  onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                />
                <span>to</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.maxPrice}
                  onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                />
              </div>
            </div>

            {/* Rating Filter */}
            <div className="filter-section">
              <h4>Customer Reviews</h4>
              <div className="filter-options">
                {ratingFilters.map(rating => (
                  <label key={rating.value} className="filter-option">
                    <input
                      type="radio"
                      name="rating"
                      value={rating.value}
                      checked={filters.rating === rating.value}
                      onChange={(e) => handleFilterChange('rating', e.target.value)}
                    />
                    <span>{rating.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="products-main">
            {/* Results Header */}
            <div className="results-header">
              <div className="results-info">
                <span className="results-count">
                  {pagination.total > 0 && (
                    `1-${Math.min(pagination.page * pagination.limit, pagination.total)} of ${pagination.total} results`
                  )}
                  {category !== 'all' && ` for "${category}"`}
                  {searchQuery && ` for "${searchQuery}"`}
                </span>
              </div>

              <div className="results-controls">
                <button 
                  className="filters-toggle"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <span className="filter-icon">⚙</span>
                  Filters
                </button>

                <div className="sort-dropdown">
                  <label>Sort by:</label>
                  <select
                    value={filters.sort}
                    onChange={(e) => handleFilterChange('sort', e.target.value)}
                  >
                    {sortOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            {loading ? (
              <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading products...</p>
              </div>
            ) : (
              <>
                <div className="products-grid">
                  {products.map(product => (
                    <div key={product.id} className="product-card">
                      <div className="product-image">
                        <img 
                          src={product.images?.[0] || product.image} 
                          alt={product.name}
                          loading="lazy"
                        />
                        {product.discount > 0 && (
                          <div className="discount-badge">
                            -{product.discount}%
                          </div>
                        )}
                        <div className="product-actions">
                          <button 
                            className="wishlist-btn"
                            onClick={() => addToWishlist(product.id)}
                            title="Add to Wishlist"
                          >
                            ♡
                          </button>
                        </div>
                      </div>

                      <div className="product-info">
                        <h3 className="product-name">
                          <a href={`/products/${product.id}`}>
                            {product.name}
                          </a>
                        </h3>

                        <div className="product-rating">
                          <div className="stars">
                            {renderStars(product.rating)}
                          </div>
                          <span className="rating-count">({product.reviews})</span>
                        </div>

                        <div className="product-pricing">
                          <span className="current-price">
                            {formatPrice(product.price)}
                          </span>
                          {product.originalPrice > product.price && (
                            <>
                              <span className="original-price">
                                {formatPrice(product.originalPrice)}
                              </span>
                              <span className="discount-percent">
                                ({product.discount}% off)
                              </span>
                            </>
                          )}
                        </div>

                        <div className="product-features">
                          {product.prime && (
                            <span className="prime-badge">
                              <img src="/prime-logo.png" alt="Prime" />
                            </span>
                          )}
                          {product.freeDelivery && (
                            <span className="free-delivery">FREE Delivery</span>
                          )}
                        </div>

                        <div className="product-seller">
                          <span>by {product.seller || product.brand}</span>
                        </div>

                        <button 
                          className="add-to-cart-btn"
                          onClick={() => addToCart(product.id)}
                          disabled={!product.inStock}
                        >
                          {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {pagination.pages > 1 && (
                  <div className="pagination">
                    <button
                      className="page-btn"
                      disabled={pagination.page === 1}
                      onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                    >
                      Previous
                    </button>

                    {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                      const pageNum = i + 1;
                      return (
                        <button
                          key={pageNum}
                          className={`page-btn ${pagination.page === pageNum ? 'active' : ''}`}
                          onClick={() => setPagination(prev => ({ ...prev, page: pageNum }))}
                        >
                          {pageNum}
                        </button>
                      );
                    })}

                    {pagination.pages > 5 && (
                      <>
                        <span className="page-ellipsis">...</span>
                        <button
                          className="page-btn"
                          onClick={() => setPagination(prev => ({ ...prev, page: pagination.pages }))}
                        >
                          {pagination.pages}
                        </button>
                      </>
                    )}

                    <button
                      className="page-btn"
                      disabled={pagination.page === pagination.pages}
                      onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default AmazonProductList;