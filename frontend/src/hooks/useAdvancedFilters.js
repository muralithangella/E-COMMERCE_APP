import { useCallback, useMemo, useReducer } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FILTERS, PAGINATION, SORT_OPTIONS } from '../constants';

const initialState = {
  search: '',
  category: '',
  brands: [],
  priceRange: [FILTERS.PRICE_RANGE.MIN, FILTERS.PRICE_RANGE.MAX],
  rating: FILTERS.RATING_RANGE.MIN,
  sort: SORT_OPTIONS[0].value,
  page: PAGINATION.DEFAULT_PAGE,
  limit: PAGINATION.DEFAULT_LIMIT,
  inStock: false,
  freeDelivery: false,
  prime: false,
};

const filterReducer = (state, action) => {
  switch (action.type) {
    case 'SET_SEARCH':
      return { ...state, search: action.payload, page: PAGINATION.DEFAULT_PAGE };
    
    case 'SET_CATEGORY':
      return { ...state, category: action.payload, page: PAGINATION.DEFAULT_PAGE };
    
    case 'TOGGLE_BRAND':
      const brands = state.brands.includes(action.payload)
        ? state.brands.filter(brand => brand !== action.payload)
        : [...state.brands, action.payload];
      return { ...state, brands, page: PAGINATION.DEFAULT_PAGE };
    
    case 'SET_PRICE_RANGE':
      return { ...state, priceRange: action.payload, page: PAGINATION.DEFAULT_PAGE };
    
    case 'SET_RATING':
      return { ...state, rating: action.payload, page: PAGINATION.DEFAULT_PAGE };
    
    case 'SET_SORT':
      return { ...state, sort: action.payload, page: PAGINATION.DEFAULT_PAGE };
    
    case 'SET_PAGE':
      return { ...state, page: action.payload };
    
    case 'SET_LIMIT':
      return { ...state, limit: action.payload, page: PAGINATION.DEFAULT_PAGE };
    
    case 'TOGGLE_FILTER':
      return { ...state, [action.payload]: !state[action.payload], page: PAGINATION.DEFAULT_PAGE };
    
    case 'RESET_FILTERS':
      return { ...initialState, limit: state.limit };
    
    case 'SET_FROM_URL':
      return { ...state, ...action.payload };
    
    default:
      return state;
  }
};

export const useAdvancedFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, dispatch] = useReducer(filterReducer, initialState);

  // Sync with URL parameters
  const syncWithURL = useCallback(() => {
    const urlParams = Object.fromEntries(searchParams);
    const parsedParams = {
      search: urlParams.search || '',
      category: urlParams.category || '',
      brands: urlParams.brands ? urlParams.brands.split(',') : [],
      priceRange: urlParams.priceRange 
        ? urlParams.priceRange.split(',').map(Number)
        : [FILTERS.PRICE_RANGE.MIN, FILTERS.PRICE_RANGE.MAX],
      rating: Number(urlParams.rating) || FILTERS.RATING_RANGE.MIN,
      sort: urlParams.sort || SORT_OPTIONS[0].value,
      page: Number(urlParams.page) || PAGINATION.DEFAULT_PAGE,
      limit: Number(urlParams.limit) || PAGINATION.DEFAULT_LIMIT,
      inStock: urlParams.inStock === 'true',
      freeDelivery: urlParams.freeDelivery === 'true',
      prime: urlParams.prime === 'true',
    };
    
    dispatch({ type: 'SET_FROM_URL', payload: parsedParams });
  }, [searchParams]);

  // Update URL when filters change
  const updateURL = useCallback(() => {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== initialState[key]) {
        if (Array.isArray(value)) {
          if (value.length > 0) params.set(key, value.join(','));
        } else if (typeof value === 'boolean') {
          if (value) params.set(key, 'true');
        } else if (value) {
          params.set(key, String(value));
        }
      }
    });
    
    setSearchParams(params);
  }, [filters, setSearchParams]);

  // Filter actions
  const actions = useMemo(() => ({
    setSearch: (search) => dispatch({ type: 'SET_SEARCH', payload: search }),
    setCategory: (category) => dispatch({ type: 'SET_CATEGORY', payload: category }),
    toggleBrand: (brand) => dispatch({ type: 'TOGGLE_BRAND', payload: brand }),
    setPriceRange: (range) => dispatch({ type: 'SET_PRICE_RANGE', payload: range }),
    setRating: (rating) => dispatch({ type: 'SET_RATING', payload: rating }),
    setSort: (sort) => dispatch({ type: 'SET_SORT', payload: sort }),
    setPage: (page) => dispatch({ type: 'SET_PAGE', payload: page }),
    setLimit: (limit) => dispatch({ type: 'SET_LIMIT', payload: limit }),
    toggleInStock: () => dispatch({ type: 'TOGGLE_FILTER', payload: 'inStock' }),
    toggleFreeDelivery: () => dispatch({ type: 'TOGGLE_FILTER', payload: 'freeDelivery' }),
    togglePrime: () => dispatch({ type: 'TOGGLE_FILTER', payload: 'prime' }),
    resetFilters: () => dispatch({ type: 'RESET_FILTERS' }),
    syncWithURL,
    updateURL,
  }), [syncWithURL, updateURL]);

  // Computed values
  const computed = useMemo(() => ({
    hasActiveFilters: filters.search || 
                     filters.category || 
                     filters.brands.length > 0 || 
                     filters.priceRange[0] > FILTERS.PRICE_RANGE.MIN || 
                     filters.priceRange[1] < FILTERS.PRICE_RANGE.MAX || 
                     filters.rating > FILTERS.RATING_RANGE.MIN ||
                     filters.inStock ||
                     filters.freeDelivery ||
                     filters.prime,
    
    activeFilterCount: [
      filters.search,
      filters.category,
      filters.brands.length > 0,
      filters.priceRange[0] > FILTERS.PRICE_RANGE.MIN || filters.priceRange[1] < FILTERS.PRICE_RANGE.MAX,
      filters.rating > FILTERS.RATING_RANGE.MIN,
      filters.inStock,
      filters.freeDelivery,
      filters.prime,
    ].filter(Boolean).length,

    queryParams: {
      ...filters,
      minPrice: filters.priceRange[0] > FILTERS.PRICE_RANGE.MIN ? filters.priceRange[0] : undefined,
      maxPrice: filters.priceRange[1] < FILTERS.PRICE_RANGE.MAX ? filters.priceRange[1] : undefined,
      brand: filters.brands.length > 0 ? filters.brands : undefined,
    },
  }), [filters]);

  return {
    filters,
    actions,
    computed,
  };
};