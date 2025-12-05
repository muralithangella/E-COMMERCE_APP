import { useState, useCallback } from 'react';

export const useAdvancedFilters = () => {
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    sort: 'relevance',
    page: 1,
  });

  const actions = {
    setSearch: useCallback((search) => setFilters(prev => ({ ...prev, search, page: 1 })), []),
    setCategory: useCallback((category) => setFilters(prev => ({ ...prev, category, page: 1 })), []),
    setSort: useCallback((sort) => setFilters(prev => ({ ...prev, sort, page: 1 })), []),
    setPage: useCallback((page) => setFilters(prev => ({ ...prev, page })), []),
    syncWithURL: useCallback(() => {}, []),
    updateURL: useCallback(() => {}, []),
  };

  const computed = {
    hasActiveFilters: filters.search || filters.category,
    activeFilterCount: [filters.search, filters.category].filter(Boolean).length,
    queryParams: filters,
  };

  return { filters, actions, computed };
};