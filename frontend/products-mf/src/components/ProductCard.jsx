import React from 'react';

const ProductCard = ({ product }) => {
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
        alert('Added to cart!');
      }
    } catch (error) {
      alert('Error adding to cart');
    }
  };

  return (
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
  );
};

export default ProductCard;