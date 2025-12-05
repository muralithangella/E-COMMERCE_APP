import React from 'react';
import ProductCard from '../ProductCard';

const ProductGrid = ({ products = [], onProductClick }) => {
  

  if (!products || products.length === 0) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <p>No products available</p>
      </div>
    );
  }
  
  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', 
      gap: '20px', 
      padding: '20px' 
    }}>
      {products.map((product) => (
        <ProductCard
          key={product.id || product._id}
          product={product}
          onProductClick={onProductClick}
          size="large"
        />
      ))}
    </div>
  );
};

export default ProductGrid;