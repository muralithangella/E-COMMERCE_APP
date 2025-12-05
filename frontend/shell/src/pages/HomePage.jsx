import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetProductsQuery, useGetCategoriesQuery } from '../store/api/apiSlice';
import { useAdvancedFilters } from '../hooks/useAdvancedFilters';
import HeroBanner from '../components/HeroBanner';
import CategoryGrid from '../components/CategoryGrid';
import ProductCarousel from '../components/ProductCarousel';
import DealsSection from '../components/DealsSection';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import styles from './HomePage.module.css';

const HomePage = () => {
  const navigate = useNavigate();
  const { filters } = useAdvancedFilters();
  
  const {
    data: productsData,
    isLoading: productsLoading,
    error: productsError
  } = useGetProductsQuery({ 
    ...filters, 
    limit: 20,
    featured: true 
  });
  
  console.log('HomePage - Products Data:', productsData);
  console.log('HomePage - Products Loading:', productsLoading);
  console.log('HomePage - Products Error:', productsError);

  const {
    data: categories,
    isLoading: categoriesLoading,
    error: categoriesError
  } = useGetCategoriesQuery();

  const {
    data: dealsData,
    isLoading: dealsLoading
  } = useGetProductsQuery({ 
    sort: 'discount',
    minDiscount: 20,
    limit: 8 
  });

  const handleProductClick = useCallback((productId) => {
    navigate(`/products/${productId}`);
  }, [navigate]);

  const handleCategoryClick = useCallback((categorySlug) => {
    navigate(`/products?category=${categorySlug}`);
  }, [navigate]);

  if (productsLoading || categoriesLoading) {
    return (
      <div className={styles.loadingContainer}>
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (productsError || categoriesError) {
    return (
      <div className={styles.errorContainer}>
        <ErrorMessage 
          message="Failed to load homepage content" 
          onRetry={() => window.location.reload()} 
        />
      </div>
    );
  }

  return (
    <main className={styles.homepage}>
      <HeroBanner />
      
      <section className={styles.section}>
        <DealsSection 
          deals={dealsData || []}
          loading={dealsLoading}
          onProductClick={handleProductClick}
        />
      </section>

      <section className={styles.section}>
        <CategoryGrid 
          categories={categories || []}
          onCategoryClick={handleCategoryClick}
        />
      </section>

      <section className={styles.section}>
        <ProductCarousel
          title="Recommended for you"
          products={productsData || []}
          onProductClick={handleProductClick}
        />
      </section>

      <section className={styles.section}>
        <ProductCarousel
          title="Recently viewed"
          products={(productsData || []).slice(0, 8)}
          onProductClick={handleProductClick}
        />
      </section>
      

    </main>
  );
};

export default HomePage;