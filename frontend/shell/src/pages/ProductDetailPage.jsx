import React from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/slices/cartSlice';
import { useGetProductsQuery } from '../store/api/apiSlice';

const ProductDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { data: products } = useGetProductsQuery();
  
  const product = products?.find(p => p.id === parseInt(id));

  const handleAddToCart = () => {
    if (product) {
      dispatch(addToCart(product));
      alert(`${product.name} added to cart!`);
    }
  };

  if (!product) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h1>Product Not Found</h1>
        <button onClick={() => window.location.href = '/products'}>
          Back to Products
        </button>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#f3f3f3', minHeight: '100vh', padding: '20px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{
          backgroundColor: 'white',
          padding: '24px',
          borderRadius: '8px',
          display: 'flex',
          gap: '40px'
        }}>
          <div style={{ flex: 1 }}>
            <img 
              src={product.image} 
              alt={product.name} 
              style={{ width: '100%', maxWidth: '400px', height: 'auto', borderRadius: '8px' }}
            />
          </div>
          
          <div style={{ flex: 1 }}>
            <h1 style={{ margin: '0 0 16px 0', fontSize: '24px' }}>{product.name}</h1>
            
            <div style={{ marginBottom: '16px' }}>
              <span style={{ fontSize: '28px', fontWeight: 'bold', color: '#B12704' }}>
                ₹{product.price}
              </span>
              {product.discount && (
                <span style={{ marginLeft: '12px', color: '#007600', fontSize: '14px' }}>
                  {product.discount}% off
                </span>
              )}
            </div>

            <div style={{ marginBottom: '20px', padding: '16px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
              <h3 style={{ margin: '0 0 8px 0' }}>Product Details:</h3>
              <p style={{ margin: 0, lineHeight: '1.5' }}>
                {product.description || 'High-quality product with excellent features and reliable performance.'}
              </p>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <div style={{ marginBottom: '8px' }}>
                <strong>Availability:</strong> <span style={{ color: '#007600' }}>In Stock</span>
              </div>
              <div style={{ marginBottom: '8px' }}>
                <strong>Shipping:</strong> FREE delivery on orders over ₹499
              </div>
              <div>
                <strong>Returns:</strong> 30-day return policy
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
              <button
                onClick={handleAddToCart}
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#ff9f00',
                  color: 'black',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  flex: 1
                }}
              >
                Add to Cart
              </button>
              
              <button
                onClick={() => {
                  handleAddToCart();
                  window.location.href = '/cart';
                }}
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#ff6b35',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  flex: 1
                }}
              >
                Buy Now
              </button>
            </div>

            <div style={{ fontSize: '12px', color: '#666' }}>
              <p>✓ Secure transaction</p>
              <p>✓ Ships from Amazon</p>
              <p>✓ Sold by Amazon</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;