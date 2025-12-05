import { useState, useEffect, useCallback, useMemo } from 'react';
import { debounce } from 'lodash';

export const useAdvancedSearch = (initialFilters = {}) => {
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    brand: [],
    priceRange: [0, 100000],
    rating: 0,
    sort: 'relevance',
    page: 1,
    limit: 20,
    ...initialFilters
  });

  const [results, setResults] = useState({
    products: [],
    pagination: {},
    facets: {},
    loading: false,
    error: null
  });

  const [suggestions, setSuggestions] = useState([]);

  const debouncedSearch = useCallback(
    debounce(async (searchFilters) => {
      try {
        setResults(prev => ({ ...prev, loading: true, error: null }));
        
        const queryParams = new URLSearchParams(searchFilters);
        const response = await fetch(`/api/products?${queryParams}`);
        const data = await response.json();
        
        setResults({
          products: data.data,
          pagination: data.pagination,
          facets: data.filters,
          loading: false,
          error: null
        });
      } catch (error) {
        setResults(prev => ({
          ...prev,
          loading: false,
          error: error.message
        }));
      }
    }, 300),
    []
  );

  const updateFilters = useCallback((newFilters) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
      page: newFilters.page || 1
    }));
  }, []);

  useEffect(() => {
    debouncedSearch(filters);
  }, [filters, debouncedSearch]);

  const filterState = useMemo(() => ({
    hasActiveFilters: filters.category || 
                     filters.brand.length > 0 || 
                     filters.priceRange[0] > 0 || 
                     filters.priceRange[1] < 100000 || 
                     filters.rating > 0
  }), [filters]);

  return {
    filters,
    results,
    suggestions,
    filterState,
    updateFilters,
    isLoading: results.loading,
    hasError: !!results.error,
    error: results.error
  };
};