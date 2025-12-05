import React from 'react';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../store/slices/cartSlice';

const ProductGrid = ({ products = [] }) => {
  console.log('ProductGrid received products:', products);
  const dispatch = useDispatch();
  
  const handleAddToCart = (e, product) => {
    e.stopPropagation();
    dispatch(addToCart({
      id: product.id || product._id,
      name: product.name,
      price: product.price,
      image: null,
      category: product.category,
      quantity: 1
    }));
    alert(`${product.name} added to cart!`);
  };
  
  const getCategoryColor = (category) => {
    const colors = {
      'mobiles': '#4A90E2',
      'electronics': '#6C5CE7', 
      'fashion': '#E74C3C',
      'home': '#F39C12',
      'books': '#27AE60',
      'sports': '#BD10E0'
    };
    return colors[category?.toLowerCase()] || '#9013FE';
  };
  
  if (!products || products.length === 0) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <p>No products available</p>
      </div>
    );
  }
  
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px', padding: '20px' }}>
      {products.map((product) => (
        <div key={product.id || product._id} style={{ 
          backgroundColor: 'white',
          border: '1px solid #D5D9D9',
          borderRadius: '8px',
          padding: '16px',
          transition: 'box-shadow 0.15s ease-in-out'
        }}>
          <div
            style={{ 
              width: '100%', 
              height: '200px', 
              backgroundColor: getCategoryColor(product.category),
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '14px',
              fontWeight: 'bold',
              textAlign: 'center',
              padding: '20px',
              marginBottom: '12px'
            }}
          >
            {product.name.split(' ').slice(0, 3).join(' ')}
          </div>
          <h3 style={{ fontSize: '16px', margin: '0 0 8px 0', lineHeight: '1.4' }}>{product.name}</h3>
          <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#B12704', margin: '0 0 12px 0' }}>₹{product.price?.toLocaleString()}</p>
          <button 
            onClick={(e) => handleAddToCart(e, product)}
            style={{ 
              width: '100%', 
              padding: '10px', 
              backgroundColor: '#FFD814', 
              color: '#0F1111',
              border: '1px solid #FCD200',
              borderRadius: '4px', 
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '400'
            }}
          >
            Add to Cart
          </button>
        </div>
      ))}
    </div>
  );
};

export default ProductGrid;