import React, { useState, useEffect } from 'react';

const addToCart = async (product) => {
  try {
    console.log('Adding product to cart:', product);
    
    if (!product || !product._id) {
      console.error('Invalid product data:', product);
      alert('Invalid product data!');
      return;
    }
    
    const cartData = { 
      productId: product._id, 
      quantity: 1,
      name: product.name || 'Unknown Product',
      price: parseFloat(product.price) || 0,
      image: product.image || 'https://via.placeholder.com/300x200'
    };
    console.log('Sending cart data:', cartData);
    const jsonBody = JSON.stringify(cartData);
    console.log('JSON body being sent:', jsonBody);
    
    const response = await fetch('http://localhost:5000/api/cart/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: jsonBody
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('Added to cart successfully:', data);
      // Force refresh cart data
      window.dispatchEvent(new CustomEvent('cartUpdated'));
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

const App = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/products');
        if (response.ok) {
          const data = await response.json();
          console.log('Products MF received:', data);
          setProducts(data.products || []);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    
    fetchProducts();
  }, []);

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>Products</h1>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
        gap: '20px',
        marginTop: '20px'
      }}>
        {products.map(product => (
          <div key={product._id} style={{
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '15px',
            backgroundColor: '#fff',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <img 
              src={product.image || 'https://via.placeholder.com/300x200'} 
              alt={product.name}
              style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '4px' }}
            />
            <h3 style={{ margin: '10px 0', color: '#333' }}>{product.name}</h3>
            <p style={{ color: '#666', fontSize: '14px', margin: '5px 0' }}>{product.description}</p>
            <p style={{ color: '#888', fontSize: '12px', margin: '5px 0' }}>Category: {product.category}</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '15px' }}>
              <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#007bff' }}>
                ${product.price}
              </span>
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  console.log('Button clicked, product:', product);
                  console.log('Product keys:', Object.keys(product || {}));
                  console.log('Product._id:', product?._id);
                  console.log('Product.name:', product?.name);
                  console.log('Product.price:', product?.price);
                  
                  if (!product || !product._id) {
                    alert('Product data is missing!');
                    return;
                  }
                  addToCart(product);
                }}
                style={{
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Add to Cart (ID: {product._id})
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <div style={{ 
        marginTop: '30px', 
        padding: '20px', 
        backgroundColor: '#f8f9fa', 
        borderRadius: '8px',
        textAlign: 'center'
      }}>
        <h3>Product Summary</h3>
        <p>Total Products: {products.length}</p>
      </div>
    </div>
  );
};

export default App;