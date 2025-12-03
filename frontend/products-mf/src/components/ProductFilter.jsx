import React from 'react'

const ProductFilter = ({ categories, selectedCategory, onCategoryChange, priceRange, onPriceChange }) => {
  return (
    <div className="product-filter">
      <h3>Filters</h3>
      
      <div className="filter-section">
        <label>Category:</label>
        <select value={selectedCategory} onChange={(e) => onCategoryChange(e.target.value)}>
          <option value="">All Categories</option>
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>

      <div className="filter-section">
        <label>Price Range:</label>
        <input
          type="range"
          min="0"
          max="1000"
          value={priceRange}
          onChange={(e) => onPriceChange(e.target.value)}
        />
        <span>Up to ${priceRange}</span>
      </div>
    </div>
  )
}

export default ProductFilter