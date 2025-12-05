import React, { memo, useMemo, useCallback } from 'react';
import { FixedSizeGrid as Grid } from 'react-window';
import { areEqual } from 'react-window';
import InfiniteLoader from 'react-window-infinite-loader';

const ProductCard = memo(({ index, style, data }) => {
  const { products, onProductClick, onAddToCart, onAddToWishlist } = data;
  const product = products[index];

  if (!product) {
    return (
      <div style={style} className="product-skeleton">
        <div className="skeleton-image"></div>
        <div className="skeleton-text"></div>
        <div className="skeleton-price"></div>
      </div>
    );
  }

  return (
    <div style={style} className="product-card-wrapper">
      <div className="product-card" onClick={() => onProductClick(product.id)}>
        <div className="product-image">
          <img 
            src={product.images?.[0]} 
            alt={product.name}
            loading="lazy"
            onError={(e) => {
              e.target.src = '/placeholder-product.jpg';
            }}
          />
          {product.discount > 0 && (
            <div className="discount-badge">-{product.discount}%</div>
          )}
        </div>
        
        <div className="product-info">
          <h3 className="product-name">{product.name}</h3>
          
          <div className="product-rating">
            <div className="stars">
              {Array.from({ length: 5 }, (_, i) => (
                <span 
                  key={i} 
                  className={`star ${i < Math.floor(product.rating) ? 'filled' : 'empty'}`}
                >
                  ★
                </span>
              ))}
            </div>
            <span className="rating-count">({product.reviews})</span>
          </div>
          
          <div className="product-pricing">
            <span className="current-price">₹{product.price.toLocaleString()}</span>
            {product.originalPrice > product.price && (
              <span className="original-price">₹{product.originalPrice.toLocaleString()}</span>
            )}
          </div>
          
          <div className="product-actions">
            <button 
              className="add-to-cart"
              onClick={(e) => {
                e.stopPropagation();
                onAddToCart(product.id);
              }}
            >
              Add to Cart
            </button>
            <button 
              className="add-to-wishlist"
              onClick={(e) => {
                e.stopPropagation();
                onAddToWishlist(product.id);
              }}
            >
              ♡
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}, areEqual);

const VirtualizedProductGrid = ({
  products,
  hasNextPage,
  isNextPageLoading,
  loadNextPage,
  onProductClick,
  onAddToCart,
  onAddToWishlist,
  containerWidth = 1200,
  containerHeight = 800
}) => {
  const itemCount = hasNextPage ? products.length + 1 : products.length;
  const isItemLoaded = useCallback((index) => !!products[index], [products]);

  const itemData = useMemo(() => ({
    products,
    onProductClick,
    onAddToCart,
    onAddToWishlist
  }), [products, onProductClick, onAddToCart, onAddToWishlist]);

  // Calculate grid dimensions
  const columnCount = Math.floor(containerWidth / 280); // 280px per item
  const rowCount = Math.ceil(itemCount / columnCount);
  const itemWidth = containerWidth / columnCount;
  const itemHeight = 400;

  const Cell = useCallback(({ columnIndex, rowIndex, style }) => {
    const index = rowIndex * columnCount + columnIndex;
    
    if (index >= itemCount) {
      return null;
    }

    return (
      <ProductCard
        index={index}
        style={style}
        data={itemData}
      />
    );
  }, [columnCount, itemCount, itemData]);

  return (
    <div className="virtualized-product-grid">
      <InfiniteLoader
        isItemLoaded={isItemLoaded}
        itemCount={itemCount}
        loadMoreItems={loadNextPage}
      >
        {({ onItemsRendered, ref }) => (
          <Grid
            ref={ref}
            columnCount={columnCount}
            columnWidth={itemWidth}
            height={containerHeight}
            rowCount={rowCount}
            rowHeight={itemHeight}
            width={containerWidth}
            onItemsRendered={({
              visibleColumnStartIndex,
              visibleColumnStopIndex,
              visibleRowStartIndex,
              visibleRowStopIndex
            }) => {
              const startIndex = visibleRowStartIndex * columnCount + visibleColumnStartIndex;
              const stopIndex = visibleRowStopIndex * columnCount + visibleColumnStopIndex;
              
              onItemsRendered({
                overscanStartIndex: startIndex,
                overscanStopIndex: stopIndex,
                visibleStartIndex: startIndex,
                visibleStopIndex: stopIndex
              });
            }}
          >
            {Cell}
          </Grid>
        )}
      </InfiniteLoader>
    </div>
  );
};

export default memo(VirtualizedProductGrid);