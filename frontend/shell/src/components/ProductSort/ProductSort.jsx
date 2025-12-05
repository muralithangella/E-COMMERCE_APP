import React from 'react';

const ProductSort = ({ onSortChange }) => {
  return (
    <div className="product-sort">
      <label>Sort by:</label>
      <select onChange={(e) => onSortChange?.(e.target.value)}>
        <option value="name">Name</option>
        <option value="price">Price</option>
        <option value="rating">Rating</option>
      </select>
    </div>
  );
};

export default ProductSort;