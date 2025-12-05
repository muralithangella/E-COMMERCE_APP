import React from 'react';
import ProductCard from '../ProductCard';

const DealsSection = ({ deals = [], loading = false, onProductClick }) => {
  

  

  if (loading) {
    return <div style={{ padding: '20px', backgroundColor: 'white' }}>Loading deals...</div>;
  }
  
  if (!deals || deals.length === 0) {
    return (
      <div style={{ padding: '20px', backgroundColor: 'white' }}>
        <h2 style={{ fontSize: '21px', fontWeight: '700', color: '#0F1111' }}>Today's Deals</h2>
        <p>No deals available at the moment</p>
      </div>
    );
  }
  
  return (
    <div style={{ padding: '20px', backgroundColor: 'white' }}>
      <h2 style={{ marginBottom: '20px', fontSize: '21px', fontWeight: '700', color: '#0F1111' }}>Today's Deals</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
        {deals.slice(0, 6).map((product) => (
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

export default DealsSection;