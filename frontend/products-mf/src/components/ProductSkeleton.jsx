import React from 'react'

const ProductSkeleton = () => {
  return (
    <div className="product-skeleton">
      <div className="skeleton-image"></div>
      <div className="skeleton-content">
        <div className="skeleton-title"></div>
        <div className="skeleton-price"></div>
        <div className="skeleton-category"></div>
      </div>
    </div>
  )
}

export default ProductSkeleton