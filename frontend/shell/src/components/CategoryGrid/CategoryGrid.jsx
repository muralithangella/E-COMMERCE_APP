import React from 'react';

const CategoryGrid = ({ categories = [], onCategoryClick }) => {
  console.log('CategoryGrid received categories:', categories);
  
  if (!categories || categories.length === 0) {
    return (
      <div style={{ padding: '20px', backgroundColor: 'white' }}>
        <h2 style={{ fontSize: '21px', fontWeight: '400', color: '#0F1111', marginBottom: '16px' }}>Shop by Category</h2>
        <p>No categories available</p>
      </div>
    );
  }
  
  return (
    <div style={{ padding: '20px', backgroundColor: 'white' }}>
      <h2 style={{ fontSize: '21px', fontWeight: '400', color: '#0F1111', marginBottom: '16px' }}>Shop by Category</h2>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(6, 1fr)', 
        gap: '16px', 
        maxWidth: '1200px'
      }}>
        {categories.map((category) => (
          <div 
            key={category.id} 
            style={{ 
              backgroundColor: 'white',
              border: '1px solid #D5D9D9',
              borderRadius: '4px',
              padding: '14px',
              textAlign: 'center',
              cursor: 'pointer',
              minHeight: '130px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
            onClick={() => onCategoryClick && onCategoryClick(category.name.toLowerCase())}
          >
            <div 
              style={{ 
                width: '70px', 
                height: '70px', 
                backgroundColor: '#F0F2F2',
                borderRadius: '4px',
                margin: '0 auto 8px auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '9px',
                color: '#565959',
                fontWeight: '400',
                textAlign: 'center',
                lineHeight: '1.2',
                padding: '6px'
              }}
            >
              {category.name.split(' ')[0]}
            </div>
            <h3 style={{ 
              margin: '0', 
              fontSize: '12px', 
              fontWeight: '400', 
              color: '#0F1111',
              lineHeight: '16px'
            }}>
              {category.name}
            </h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryGrid;