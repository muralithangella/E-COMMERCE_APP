import React from 'react';
import { useProducts } from '../../../shared/hooks/useProducts';
import { useCart } from '../../../shared/hooks/useCart';

const ProductList = ({ products = [], loading = false }) => {
  const { addToCart, isAdding } = useCart();

  if (loading) return <div>Loading products...</div>;
  if (!products.length) return <div>No products found</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h2>Products</h2>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        gap: '20px',
        marginTop: '20px'
      }}>
        {products.map((product) => (
          <div key={product._id} style={{
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '16px',
            textAlign: 'center'
          }}>
            <img
              src={product.image || `https://picsum.photos/200/150?random=${product._id}`}
              alt={product.name}
              style={{
                width: '100%',
                height: '150px',
                objectFit: 'cover',
                borderRadius: '4px',
                marginBottom: '12px'
              }}
            />
            <h3 style={{ margin: '0 0 8px 0', fontSize: '16px' }}>{product.name}</h3>
            <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#B12704' }}>
              ${product.price}
            </p>
            <p style={{ fontSize: '14px', color: '#666' }}>
              {product.description}
            </p>
            <button
              onClick={() => addToCart(product.id)}
              disabled={isAdding}
              style={{
                backgroundColor: '#ff9f00',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 'bold',
                marginTop: '10px'
              }}
            >
              {isAdding ? 'Adding...' : 'Add to Cart'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;