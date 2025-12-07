import { useState, useCallback } from 'react';

export const useAdvancedFilters = () => {
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    sort: 'relevance',
    page: 1,
    minPrice: '',
    maxPrice: '',
  });

  const actions = {
    setSearch: useCallback((search) => setFilters(prev => ({ ...prev, search, page: 1 })), []),
    setCategory: useCallback((category) => setFilters(prev => ({ ...prev, category, page: 1 })), []),
    setSort: useCallback((sort) => setFilters(prev => ({ ...prev, sort, page: 1 })), []),
    setPage: useCallback((page) => setFilters(prev => ({ ...prev, page })), []),
    setPriceRange: useCallback((minPrice, maxPrice) => setFilters(prev => ({ ...prev, minPrice, maxPrice, page: 1 })), []),
    syncWithURL: useCallback(() => {}, []),
    updateURL: useCallback(() => {}, []),
  };

  const computed = {
    hasActiveFilters: filters.search || filters.category || filters.minPrice || filters.maxPrice,
    activeFilterCount: [filters.search, filters.category, filters.minPrice || filters.maxPrice].filter(Boolean).length,
    queryParams: Object.fromEntries(Object.entries(filters).filter(([_, v]) => v !== '' && v !== null && v !== undefined)),
  };

  return { filters, actions, computed };
};
