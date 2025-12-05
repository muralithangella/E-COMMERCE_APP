import React, { useState, useEffect, useCallback } from 'react';

const API_BASE = 'http://localhost:5010';

const ProductCard = ({ product, onAddToCart }) => (
  <div style={{
    backgroundColor: 'white',
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '16px',
    textAlign: 'center',
    transition: 'box-shadow 0.2s',
    cursor: 'pointer'
  }}
  onMouseEnter={(e) => e.target.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)'}
  onMouseLeave={(e) => e.target.style.boxShadow = 'none'}
  >
    <img 
      src={product.image} 
      alt={product.name}
      style={{
        width: '100%',
        height: '200px',
        objectFit: 'cover',
        borderRadius: '4px',
        marginBottom: '12px'
      }}
      onError={(e) => {
        e.target.src = `https://via.placeholder.com/200x200/f0f0f0/666666?text=${encodeURIComponent(product.name.substring(0, 10))}`;
      }}
    />
    <h3 style={{
      margin: '0 0 8px 0',
      fontSize: '14px',
      fontWeight: 'normal',
      color: '#0066c0',
      textAlign: 'left',
      lineHeight: '1.3'
    }}>{product.name}</h3>
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
      <div style={{ color: '#ffa41c', fontSize: '14px' }}>
        ★★★★☆
      </div>
      <span style={{ marginLeft: '4px', fontSize: '12px', color: '#0066c0' }}>
        ({Math.floor(Math.random() * 1000) + 100})
      </span>
    </div>
    <div style={{ marginBottom: '8px', textAlign: 'left' }}>
      <span style={{ fontSize: '18px', fontWeight: 'normal', color: '#0f1111' }}>
        ₹{product.price}
      </span>
    </div>
    <div style={{ fontSize: '12px', color: '#007600', marginBottom: '8px', textAlign: 'left' }}>
      FREE delivery
    </div>
    <button 
      onClick={() => onAddToCart(product)}
      disabled={!product.inStock}
      style={{
        backgroundColor: product.inStock ? '#ff9f00' : '#ccc',
        border: '1px solid #e47911',
        borderRadius: '8px',
        padding: '6px 12px',
        cursor: product.inStock ? 'pointer' : 'not-allowed',
        fontSize: '12px',
        width: '100%',
        color: product.inStock ? '#000' : '#666'
      }}
    >
      {product.inStock ? 'Add to cart' : 'Out of Stock'}
    </button>
  </div>
);

const App = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/api/products`);
      if (!response.ok) throw new Error('Failed to fetch products');
      
      const data = await response.json();
      setProducts(data.products || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const addToCart = useCallback(async (product) => {
    try {
      const response = await fetch(`${API_BASE}/api/cart/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product.id, quantity: 1 })
      });
      
      if (!response.ok) throw new Error('Failed to add to cart');
      
      const result = await response.json();
      alert(result.message);
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  if (loading) return (
    <div style={{ 
      backgroundColor: '#eaeded', 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center' 
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '18px', marginBottom: '10px' }}>Loading products...</div>
        <div style={{ color: '#666' }}>Please wait while we fetch the latest products</div>
      </div>
    </div>
  );
  
  if (error) return (
    <div style={{ 
      backgroundColor: '#eaeded', 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center' 
    }}>
      <div style={{ 
        backgroundColor: 'white', 
        padding: '40px', 
        borderRadius: '8px', 
        textAlign: 'center',
        border: '1px solid #ddd'
      }}>
        <h2 style={{ color: '#cc0c39', marginBottom: '10px' }}>Error Loading Products</h2>
        <p style={{ color: '#666', marginBottom: '20px' }}>{error}</p>
        <button 
          onClick={fetchProducts}
          style={{
            backgroundColor: '#ff9f00',
            border: '1px solid #e47911',
            borderRadius: '8px',
            padding: '8px 16px',
            cursor: 'pointer'
          }}
        >
          Try Again
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ backgroundColor: '#eaeded', minHeight: '100vh', padding: '20px 0' }}>
      <div style={{ maxWidth: '1500px', margin: '0 auto', padding: '0 20px' }}>
        {/* Breadcrumb */}
        <div style={{ marginBottom: '20px', fontSize: '14px' }}>
          <a href="/" style={{ color: '#0066c0', textDecoration: 'none' }}>Home</a>
          <span style={{ margin: '0 8px', color: '#666' }}>›</span>
          <span style={{ color: '#666' }}>All Products</span>
        </div>

        {/* Results header */}
        <div style={{
          backgroundColor: 'white',
          padding: '16px 20px',
          borderRadius: '8px',
          marginBottom: '20px',
          border: '1px solid #ddd'
        }}>
          <h1 style={{ margin: '0', fontSize: '16px', fontWeight: 'normal' }}>
            Results for "all products"
          </h1>
          <div style={{ fontSize: '14px', color: '#666', marginTop: '4px' }}>
            {products.length} results
          </div>
        </div>

        {/* Products grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
          gap: '20px'
        }}>
          {products.map(product => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onAddToCart={addToCart}
            />
          ))}
        </div>

        {products.length === 0 && !loading && (
          <div style={{
            backgroundColor: 'white',
            padding: '40px',
            textAlign: 'center',
            borderRadius: '8px',
            border: '1px solid #ddd'
          }}>
            <h2 style={{ color: '#666', fontSize: '18px' }}>No products found</h2>
            <p style={{ color: '#666' }}>Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;