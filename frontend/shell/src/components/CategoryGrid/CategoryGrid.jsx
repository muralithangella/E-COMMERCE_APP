import React from 'react';
import ProductService from '../../services/productService';

const CategoryGrid = ({ categories = [], onCategoryClick }) => {
  const defaultCategories = [
    { id: '1', name: 'Mobiles' },
    { id: '2', name: 'Electronics' },
    { id: '3', name: 'Fashion' },
    { id: '4', name: 'Home & Kitchen' },
    { id: '5', name: 'Beauty & Personal Care' },
    { id: '6', name: 'Books' },
    { id: '7', name: 'Sports, Fitness & Outdoors' },
    { id: '8', name: 'Toys & Games' },
    { id: '9', name: 'Grocery & Gourmet Foods' },
    { id: '10', name: 'Health & Household' },
    { id: '11', name: 'Car & Motorbike' },
    { id: '12', name: 'Baby' }
  ];
  
  const displayCategories = categories.length > 0 ? categories : defaultCategories;
  
  if (!displayCategories || displayCategories.length === 0) {
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
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', 
        gap: '16px', 
        maxWidth: '1200px'
      }}>
        {displayCategories.slice(0, 12).map((category) => {
          const categoryName = category.name || category;
          const categoryColor = ProductService.getCategoryColor(categoryName);
          const categoryIcon = ProductService.getCategoryIcon(categoryName);
          
          return (
            <div 
              key={category.id || categoryName} 
              style={{ 
                backgroundColor: 'white',
                border: '1px solid #D5D9D9',
                borderRadius: '8px',
                padding: '16px',
                textAlign: 'center',
                cursor: 'pointer',
                minHeight: '140px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                transition: 'all 0.15s ease-in-out',
                position: 'relative',
                overflow: 'hidden'
              }}
              onClick={() => onCategoryClick && onCategoryClick(categoryName.toLowerCase())}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div 
                style={{ 
                  width: '80px', 
                  height: '80px', 
                  backgroundColor: categoryColor,
                  borderRadius: '50%',
                  margin: '0 auto 12px auto',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '32px',
                  color: 'white',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                  position: 'relative'
                }}
              >
                {categoryIcon}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 50%, rgba(0,0,0,0.1) 100%)',
                  borderRadius: '50%'
                }} />
              </div>
              <h3 style={{ 
                margin: '0', 
                fontSize: '13px', 
                fontWeight: '500', 
                color: '#0F1111',
                lineHeight: '18px',
                textAlign: 'center'
              }}>
                {categoryName}
              </h3>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryGrid;