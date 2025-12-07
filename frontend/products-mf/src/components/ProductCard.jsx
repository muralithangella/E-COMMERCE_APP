import React, { useState } from 'react';
import Toast from './Toast';

const ProductCard = ({ product }) => {
  const [toast, setToast] = useState(null);

  const handleAddToCart = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/cart/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product._id || product.id,
          name: product.name,
          price: product.price,
          quantity: 1
        })
      });
      
      if (response.ok) {
        setToast({ message: `${product.name} added to cart!`, type: 'success' });
      }
    } catch (error) {
      setToast({ message: 'Error adding to cart', type: 'error' });
    }
  };

  return (
    <>
      <div className="product-card">
      <div className="product-image">
        <img 
          src={product.image || product.images?.[0] || 'https://picsum.photos/300/200'} 
          alt={product.name}
        />
      </div>
      
      <div className="product-info">
        <h3>{product.name}</h3>
        <p>{product.description}</p>
        <div className="price">${product.price}</div>
        
        <div className="product-actions">
          <button 
            className="add-to-cart-btn"
            onClick={handleAddToCart}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
    {toast && (
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast(null)}
      />
    )}
    </>
  );
};

export default ProductCard;