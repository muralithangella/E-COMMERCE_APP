import { useState } from 'react';

export const useCart = () => {
  const [loading, setLoading] = useState(false);

  const addToCart = async (product) => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8081/api/cart/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          productId: product.id || product._id,
          name: product.name,
          price: product.price,
          image: product.images?.[0]?.url,
          quantity: 1
        })
      });
      
      if (response.ok) {
        return { success: true };
      }
      throw new Error('Failed to add to cart');
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  return { addToCart, loading };
};

export default useCart;