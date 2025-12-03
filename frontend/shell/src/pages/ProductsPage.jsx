import React, { Suspense } from 'react';

const ProductsApp = React.lazy(() => import('products/ProductsApp'));

const ProductsPage = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading products...</div>}>
        <ProductsApp />
      </Suspense>
    </div>
  );
};

export default ProductsPage;