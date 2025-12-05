import React, { memo, useCallback, useMemo } from 'react';
import { FixedSizeGrid as Grid } from 'react-window';
import InfiniteLoader from 'react-window-infinite-loader';
import { useAddToCartMutation, useAddToWishlistMutation } from '../../store/api/apiSlice';
import { useResponsive } from '../../hooks/useResponsive';
import { GRID_CONFIG } from '../../constants';
import ProductCard from '../ProductCard/ProductCard';
import ProductSkeleton from './ProductSkeleton';
import styles from './ProductGrid.module.css';

const ProductGrid = memo(({
  products = [],
  hasNextPage = false,
  isNextPageLoading = false,
  loadNextPage,
  onProductClick,
  containerRef,
}) => {
  const { isMobile } = useResponsive();
  const [addToCart] = useAddToCartMutation();
  const [addToWishlist] = useAddToWishlistMutation();

  const gridConfig = useMemo(() => {
    const containerWidth = containerRef?.current?.offsetWidth || window.innerWidth;
    const itemWidth = isMobile ? containerWidth - 20 : GRID_CONFIG.ITEM_WIDTH;
    const columnCount = Math.floor(containerWidth / (itemWidth + GRID_CONFIG.GAP));
    
    return {
      columnCount: Math.max(1, columnCount),
      itemWidth: Math.floor(containerWidth / Math.max(1, columnCount)) - GRID_CONFIG.GAP,
      itemHeight: GRID_CONFIG.ITEM_HEIGHT,
      containerWidth,
    };
  }, [isMobile, containerRef]);

  const handleAddToCart = useCallback(async (productId) => {
    try {
      await addToCart({ productId, quantity: 1 }).unwrap();
    } catch (error) {
      console.error('Failed to add to cart:', error);
    }
  }, [addToCart]);

  const handleAddToWishlist = useCallback(async (productId) => {
    try {
      await addToWishlist({ productId }).unwrap();
    } catch (error) {
      console.error('Failed to add to wishlist:', error);
    }
  }, [addToWishlist]);

  const itemCount = hasNextPage ? products.length + 1 : products.length;
  const isItemLoaded = useCallback((index) => !!products[index], [products]);

  const Cell = useCallback(({ columnIndex, rowIndex, style }) => {
    const index = rowIndex * gridConfig.columnCount + columnIndex;
    
    if (index >= itemCount) return null;

    const product = products[index];
    
    if (!product) {
      return (
        <div style={style} className={styles.cellWrapper}>
          <ProductSkeleton />
        </div>
      );
    }

    return (
      <div style={style} className={styles.cellWrapper}>
        <ProductCard
          product={product}
          onProductClick={onProductClick}
          onAddToCart={handleAddToCart}
          onAddToWishlist={handleAddToWishlist}
        />
      </div>
    );
  }, [gridConfig.columnCount, itemCount, products, onProductClick, handleAddToCart, handleAddToWishlist]);

  const rowCount = Math.ceil(itemCount / gridConfig.columnCount);

  return (
    <div className={styles.gridContainer}>
      <InfiniteLoader
        isItemLoaded={isItemLoaded}
        itemCount={itemCount}
        loadMoreItems={loadNextPage}
      >
        {({ onItemsRendered, ref }) => (
          <Grid
            ref={ref}
            className={styles.grid}
            columnCount={gridConfig.columnCount}
            columnWidth={gridConfig.itemWidth}
            height={600}
            rowCount={rowCount}
            rowHeight={gridConfig.itemHeight}
            width={gridConfig.containerWidth}
            onItemsRendered={({
              visibleColumnStartIndex,
              visibleColumnStopIndex,
              visibleRowStartIndex,
              visibleRowStopIndex,
            }) => {
              const startIndex = visibleRowStartIndex * gridConfig.columnCount;
              const stopIndex = visibleRowStopIndex * gridConfig.columnCount + visibleColumnStopIndex;
              
              onItemsRendered({
                overscanStartIndex: Math.max(0, startIndex - gridConfig.columnCount),
                overscanStopIndex: Math.min(itemCount - 1, stopIndex + gridConfig.columnCount),
                visibleStartIndex: startIndex,
                visibleStopIndex: stopIndex,
              });
            }}
          >
            {Cell}
          </Grid>
        )}
      </InfiniteLoader>
    </div>
  );
});

ProductGrid.displayName = 'ProductGrid';

export default ProductGrid;