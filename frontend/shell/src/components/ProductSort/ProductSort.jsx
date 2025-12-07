import React from 'react';

const ProductSort = ({ value, onChange }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <label style={{ fontSize: '14px', color: '#565959' }}>Sort by:</label>
      <select 
        value={value || 'relevance'}
        onChange={(e) => onChange?.(e.target.value)}
        style={{
          padding: '8px 12px',
          border: '1px solid #D5D9D9',
          borderRadius: '4px',
          fontSize: '14px',
          backgroundColor: 'white',
          cursor: 'pointer'
        }}
      >
        <option value="relevance">Featured</option>
        <option value="price-asc">Price: Low to High</option>
        <option value="price-desc">Price: High to Low</option>
        <option value="rating">Customer Rating</option>
        <option value="popularity">Popularity</option>
        <option value="discount">Highest Discount</option>
        <option value="newest">Newest Arrivals</option>
        <option value="name-asc">Name: A to Z</option>
        <option value="name-desc">Name: Z to A</option>
      </select>
    </div>
  );
};

export default ProductSort;