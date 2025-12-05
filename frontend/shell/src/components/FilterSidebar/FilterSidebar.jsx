import React from 'react';

const FilterSidebar = ({ onFilterChange }) => {
  return (
    <div className="filter-sidebar">
      <h3>Filters</h3>
      <div className="filter-group">
        <h4>Price Range</h4>
        <input type="range" min="0" max="1000" />
      </div>
    </div>
  );
};

export default FilterSidebar;