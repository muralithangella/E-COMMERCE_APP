import React, { useState, useEffect } from 'react';

const addToCart = async (productId) => {
  try {
    console.log('Adding product to cart:', productId);
    const response = await fetch('http://localhost:5000/api/cart/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ productId, quantity: 1 })
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('Added to cart successfully:', data);
      alert('Product added to cart!');
    } else {
      console.error('Failed to add to cart');
      alert('Failed to add to cart');
    }
  } catch (error) {
    console.error('Error adding to cart:', error);
    alert('Error adding to cart');
  }
};

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/products');
        if (response.ok) {
          const data = await response.json();
          console.log('ProductList received data:', data);
          const productsList = data.products || data.data || [];
          console.log('Products to display:', productsList);
          setProducts(productsList);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, []);

  if (loading) return <div>Loading products...</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h2>Products</h2>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        gap: '20px',
        marginTop: '20px'
      }}>
        {products.map((product) => (
          <div key={product._id} style={{
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '16px',
            textAlign: 'center'
          }}>
            <img
              src={product.images?.[0] || `https://picsum.photos/200/150?random=${product._id}`}
              alt={product.name}
              style={{
                width: '100%',
                height: '150px',
                objectFit: 'cover',
                borderRadius: '4px',
                marginBottom: '12px'
              }}
            />
            <h3 style={{ margin: '0 0 8px 0', fontSize: '16px' }}>{product.name}</h3>
            <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#B12704' }}>
              ${product.price}
            </p>
            <p style={{ fontSize: '14px', color: '#666' }}>
              {product.description}
            </p>
            <button
              onClick={() => {
                console.log('ProductList - Adding product:', product);
                addToCart(product.id);
              }}
              style={{
                backgroundColor: '#ff9f00',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 'bold',
                marginTop: '10px'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#e68900'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#ff9f00'}
            >
              Add to Cart (ID: {product.id})
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;