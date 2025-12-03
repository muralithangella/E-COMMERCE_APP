import React, { useState, useEffect } from 'react';
// import Toast from '../../shared/components/Toast';

// Simple Toast component for now
const Toast = ({ message, type, onClose }) => (
  <div style={{
    position: 'fixed',
    top: '20px',
    right: '20px',
    padding: '12px 20px',
    backgroundColor: type === 'error' ? '#ff4444' : '#4CAF50',
    color: 'white',
    borderRadius: '4px',
    zIndex: 1000
  }}>
    {message}
  </div>
);

const ProductsApp = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const urlParams = new URLSearchParams(window.location.search);
        const category = urlParams.get('category');
        
        let url = 'http://localhost:5000/api/products';
        if (category) {
          url += `?category=${encodeURIComponent(category)}`;
        }
        
        console.log('Fetching products from:', url);
        
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Products data:', data);
        
        setProducts(data.products || []);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const addToCart = async (product) => {
    try {
      console.log('Adding product to cart:', product);
      const response = await fetch('http://localhost:5000/api/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId: product.id, quantity: 1 })
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('Added to cart successfully:', data);
        showToast(`${product.name} added to cart!`);
      } else {
        console.error('Failed to add to cart');
        showToast('Failed to add to cart', 'error');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      showToast('Error adding to cart', 'error');
    }
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '400px',
        fontSize: '18px',
        color: '#666'
      }}>
        Loading products...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '400px',
        fontSize: '18px',
        color: '#B12704'
      }}>
        <p>Error loading products: {error}</p>
        <button 
          onClick={() => window.location.reload()}
          style={{
            padding: '10px 20px',
            backgroundColor: '#ff9f00',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginTop: '10px'
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', backgroundColor: '#f3f3f3', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        <div style={{ 
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          marginBottom: '20px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h1 style={{ 
            margin: '0 0 10px 0',
            fontSize: '28px',
            fontWeight: '400',
            color: '#232f3e'
          }}>
            Products
          </h1>
          <p style={{ 
            margin: '0',
            color: '#666',
            fontSize: '16px'
          }}>
            {products.length} results
          </p>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
          gap: '20px'
        }}>
          {products.map(product => (
            <div key={product._id} style={{
              border: '1px solid #ddd',
              borderRadius: '8px',
              padding: '16px',
              backgroundColor: '#fff',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              transition: 'transform 0.2s, box-shadow 0.2s',
              cursor: 'pointer'
            }}>
              
              <div style={{ position: 'relative', marginBottom: '12px' }}>
                <img 
                  src={product.image}
                  alt={product.name}
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
                  }}
                  style={{ 
                    width: '100%', 
                    height: '200px', 
                    objectFit: 'cover', 
                    borderRadius: '4px' 
                  }}
                />
                {product.prime && (
                  <span style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    backgroundColor: '#00a8ff',
                    color: 'white',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    fontSize: '10px',
                    fontWeight: 'bold'
                  }}>
                    Prime
                  </span>
                )}
              </div>

              <h3 style={{ 
                margin: '0 0 8px 0', 
                fontSize: '16px',
                fontWeight: '500',
                color: '#0066c0',
                lineHeight: '1.3'
              }}>
                {product.name}
              </h3>
              
              {product.rating && (
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    {'★'.repeat(Math.floor(product.rating))}
                    {'☆'.repeat(5 - Math.floor(product.rating))}
                  </div>
                  <span style={{ 
                    marginLeft: '8px', 
                    fontSize: '14px', 
                    color: '#0066c0' 
                  }}>
                    ({product.reviewCount || 0})
                  </span>
                </div>
              )}

              <p style={{ 
                color: '#666', 
                fontSize: '14px', 
                margin: '0 0 12px 0',
                lineHeight: '1.4'
              }}>
                {product.description}
              </p>

              <div style={{ marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                  <span style={{ 
                    fontSize: '24px', 
                    fontWeight: 'bold', 
                    color: '#B12704' 
                  }}>
                    ${product.price}
                  </span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span style={{ 
                      fontSize: '14px', 
                      color: '#666',
                      textDecoration: 'line-through'
                    }}>
                      ${product.originalPrice}
                    </span>
                  )}
                </div>
                
                {product.freeShipping && (
                  <div style={{ 
                    fontSize: '12px', 
                    color: '#007600',
                    fontWeight: '500',
                    marginTop: '4px'
                  }}>
                    FREE Shipping
                  </div>
                )}
                
                <div style={{ 
                  fontSize: '12px', 
                  color: product.inStock ? '#007600' : '#B12704',
                  marginTop: '4px'
                }}>
                  {product.inStock ? 
                    `In Stock${product.stockCount ? ` (${product.stockCount} available)` : ''}` : 
                    'Out of Stock'
                  }
                </div>
              </div>

              <button 
                onClick={() => addToCart(product)}
                disabled={!product.inStock}
                style={{
                  width: '100%',
                  padding: '10px',
                  backgroundColor: product.inStock ? '#ff9f00' : '#ccc',
                  color: product.inStock ? '#000' : '#666',
                  border: '1px solid #ff9f00',
                  borderRadius: '20px',
                  cursor: product.inStock ? 'pointer' : 'not-allowed',
                  fontSize: '14px',
                  fontWeight: '500',
                  transition: 'background-color 0.2s'
                }}
              >
                {product.inStock ? 'Add to Cart' : 'Out of Stock'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {toasts.map(toast => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => {}}
        />
      ))}
    </div>
  );
};

export default ProductsApp;