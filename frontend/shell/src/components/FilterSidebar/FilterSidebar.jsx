import React, { useState } from 'react';

const FilterSidebar = ({ filters, actions }) => {
  const [minInput, setMinInput] = useState('');
  const [maxInput, setMaxInput] = useState('');

  const priceRanges = [
    { label: 'Under ₹1,000', min: 0, max: 1000 },
    { label: '₹1,000 - ₹5,000', min: 1000, max: 5000 },
    { label: '₹5,000 - ₹10,000', min: 5000, max: 10000 },
    { label: '₹10,000 - ₹20,000', min: 10000, max: 20000 },
    { label: '₹20,000 & Above', min: 20000, max: 999999 }
  ];

  const handleRangeClick = (min, max) => {
    actions?.setPriceRange(min, max);
  };

  const handleCustomApply = () => {
    const min = minInput ? Number(minInput) : '';
    const max = maxInput ? Number(maxInput) : '';
    actions?.setPriceRange(min, max);
  };

  return (
    <div style={{ padding: '16px', backgroundColor: 'white', borderRadius: '4px', border: '1px solid #ddd' }}>
      <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '16px', borderBottom: '1px solid #ddd', paddingBottom: '8px' }}>Price Range</h3>
      
      {priceRanges.map((range, idx) => (
        <div 
          key={idx}
          onClick={() => handleRangeClick(range.min, range.max)}
          style={{ 
            padding: '8px 12px', 
            cursor: 'pointer', 
            fontSize: '13px',
            borderRadius: '4px',
            marginBottom: '4px',
            backgroundColor: filters?.minPrice == range.min && filters?.maxPrice == range.max ? '#e3f2fd' : 'transparent'
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#f3f3f3'}
          onMouseLeave={(e) => e.target.style.backgroundColor = filters?.minPrice == range.min && filters?.maxPrice == range.max ? '#e3f2fd' : 'transparent'}
        >
          {range.label}
        </div>
      ))}

      <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #ddd' }}>
        <div style={{ fontSize: '13px', fontWeight: 'bold', marginBottom: '8px' }}>Custom Range</div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px' }}>
          <input 
            type="number" 
            placeholder="Min"
            value={minInput}
            onChange={(e) => setMinInput(e.target.value)}
            style={{ width: '70px', padding: '6px', border: '1px solid #888', borderRadius: '3px', fontSize: '13px' }}
          />
          <span style={{ color: '#888' }}>to</span>
          <input 
            type="number" 
            placeholder="Max"
            value={maxInput}
            onChange={(e) => setMaxInput(e.target.value)}
            style={{ width: '70px', padding: '6px', border: '1px solid #888', borderRadius: '3px', fontSize: '13px' }}
          />
        </div>
        <button 
          onClick={handleCustomApply}
          style={{ 
            width: '160px', 
            padding: '6px', 
            backgroundColor: '#f0c14b', 
            border: '1px solid #a88734',
            borderRadius: '3px',
            cursor: 'pointer',
            fontSize: '13px'
          }}
        >
          Go
        </button>
      </div>
    </div>
  );
};

export default FilterSidebar;
