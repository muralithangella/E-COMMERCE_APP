import { useGetProductsQuery, useGetProductQuery, useSearchProductsQuery } from '../services/productsApi';
import { useState, useMemo } from 'react';

export const useProducts = (initialParams = {}) => {
  const [params, setParams] = useState(initialParams);
  const { data, isLoading, error, refetch } = useGetProductsQuery(params);

  const products = useMemo(() => {
    return data?.products || data || [];
  }, [data]);

  const updateFilters = (newParams) => {
    setParams(prev => ({ ...prev, ...newParams }));
  };

  return {
    products,
    isLoading,
    error,
    params,
    updateFilters,
    refetch,
  };
};

export const useProduct = (id) => {
  const { data: product, isLoading, error } = useGetProductQuery(id, {
    skip: !id,
  });

  return {
    product,
    isLoading,
    error,
  };
};

export const useProductSearch = () => {
  const [searchParams, setSearchParams] = useState({ query: '', filters: {} });
  const { data, isLoading, error } = useSearchProductsQuery(searchParams, {
    skip: !searchParams.query,
  });

  const search = (query, filters = {}) => {
    setSearchParams({ query, filters });
  };

  return {
    products: data?.products || data || [],
    isLoading,
    error,
    search,
    searchParams,
  };
};