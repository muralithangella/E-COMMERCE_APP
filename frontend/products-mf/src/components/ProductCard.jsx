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
          src={product.image || product.images?.[0]?.url || `https://picsum.photos/300/300?random=${product.id || product._id}`} 
          alt={product.name}
          onError={(e) => {
            e.target.src = `https://via.placeholder.com/300x300/f0f0f0/666666?text=${encodeURIComponent(product.name.substring(0, 20))}`;
          }}
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