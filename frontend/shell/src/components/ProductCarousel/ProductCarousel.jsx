import React from 'react';
import ProductCard from '../ProductCard';

const ProductCarousel = ({ title = 'Featured Products', products = [], onProductClick }) => {
  


  

  if (!products || products.length === 0) {
    return (
      <div style={{ padding: '20px', backgroundColor: 'white' }}>
        <h2 style={{ marginBottom: '20px', fontSize: '21px', fontWeight: '700' }}>{title}</h2>
        <p>No products available</p>
      </div>
    );
  }
  
  return (
    <div style={{ padding: '20px', backgroundColor: 'white' }}>
      <h2 style={{ marginBottom: '20px', fontSize: '21px', fontWeight: '700', color: '#0F1111' }}>{title}</h2>
      <div style={{ display: 'flex', gap: '16px', overflowX: 'auto', paddingBottom: '10px' }}>
        {products.slice(0, 8).map((product) => (
          <ProductCard
            key={product.id || product._id}
            product={product}
            onProductClick={onProductClick}
            size="medium"
          />
        ))}
      </div>
    </div>
  );
};

export default ProductCarousel;