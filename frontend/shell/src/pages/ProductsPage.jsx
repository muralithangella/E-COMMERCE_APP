import React, { useCallback, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useGetProductsQuery } from '../store/api/apiSlice';
import { useAdvancedFilters } from '../hooks/useAdvancedFilters';
import { useResponsive } from '../hooks/useResponsive';
import ProductGrid from '../components/ProductGrid';
import FilterSidebar from '../components/FilterSidebar';
import ProductSort from '../components/ProductSort';
import Breadcrumb from '../components/Breadcrumb';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import Pagination from '../components/Pagination';
import styles from './ProductsPage.module.css';

const ProductsPage = () => {
  const [searchParams] = useSearchParams();
  const { isMobile } = useResponsive();
  const containerRef = useRef(null);
  
  const { filters, actions, computed } = useAdvancedFilters();
  
  // Get category from URL params
  const categoryFromUrl = searchParams.get('category');
  
  const queryParams = {
    ...computed.queryParams,
    ...(categoryFromUrl && { category: categoryFromUrl })
  };

  const {
    data: productsData,
    isLoading,
    error,
    isFetching
  } = useGetProductsQuery(queryParams, {
    skip: false,
    refetchOnMountOrArgChange: true
  });
  
  console.log('ProductsPage - Products Data:', productsData);
  console.log('ProductsPage - Loading:', isLoading);
  console.log('ProductsPage - Error:', error);
  console.log('ProductsPage - Category from URL:', categoryFromUrl);
  console.log('ProductsPage - Query Params:', queryParams);

  // Sync filters with URL on mount
  useEffect(() => {
    actions.syncWithURL();
  }, [actions]);

  // Update URL when filters change
  useEffect(() => {
    actions.updateURL();
  }, [filters, actions]);

  const handleProductClick = useCallback((productId) => {
    window.open(`/products/${productId}`, '_blank');
  }, []);

  const handleLoadMore = useCallback(() => {
    if (productsData?.pagination?.page < productsData?.pagination?.pages) {
      actions.setPage(productsData.pagination.page + 1);
    }
  }, [productsData?.pagination, actions]);

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    ...(filters.category ? [{ label: filters.category, href: `/products?category=${filters.category}` }] : []),
    ...(filters.search ? [{ label: `Search: "${filters.search}"` }] : [])
  ];

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <ErrorMessage 
          message="Failed to load products" 
          onRetry={() => window.location.reload()} 
        />
      </div>
    );
  }

  return (
    <div className={styles.productsPage} ref={containerRef}>
      <div className={styles.container}>
        <Breadcrumb items={breadcrumbItems} />
        
        <div className={styles.content}>
          {!isMobile && (
            <aside className={styles.sidebar}>
              <FilterSidebar
                filters={filters}
                actions={actions}
                computed={computed}
                availableFilters={productsData?.filters}
              />
            </aside>
          )}

          <main className={styles.main}>
            <div className={styles.header}>
              <div className={styles.resultsInfo}>
                {productsData?.pagination && (
                  <span className={styles.resultsCount}>
                    {productsData.pagination.total > 0 && (
                      `${((productsData.pagination.page - 1) * productsData.pagination.limit) + 1}-${Math.min(
                        productsData.pagination.page * productsData.pagination.limit,
                        productsData.pagination.total
                      )} of ${productsData.pagination.total} results`
                    )}
                    {filters.search && ` for "${filters.search}"`}
                  </span>
                )}
              </div>

              <div className={styles.controls}>
                {isMobile && (
                  <button 
                    className={styles.filterToggle}
                    onClick={() => {/* Open mobile filter modal */}}
                  >
                    Filters {computed.activeFilterCount > 0 && `(${computed.activeFilterCount})`}
                  </button>
                )}
                
                <ProductSort
                  value={filters.sort}
                  onChange={actions.setSort}
                />
              </div>
            </div>

            {isLoading ? (
              <div className={styles.loadingContainer}>
                <LoadingSpinner size="lg" />
              </div>
            ) : (
              <>
                <ProductGrid
                  products={Array.isArray(productsData) ? productsData : (productsData?.products || [])}
                  hasNextPage={productsData?.pagination?.page < productsData?.pagination?.pages}
                  isNextPageLoading={isFetching}
                  loadNextPage={handleLoadMore}
                  onProductClick={handleProductClick}
                  containerRef={containerRef}
                />

                {productsData?.pagination?.pages > 1 && (
                  <Pagination
                    currentPage={productsData.pagination.page}
                    totalPages={productsData.pagination.pages}
                    onPageChange={actions.setPage}
                  />
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;