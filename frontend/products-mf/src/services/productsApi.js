import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const productsApi = createApi({
  reducerPath: 'productsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:5000/api/products',
  }),
  tagTypes: ['Product'],
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: (params = {}) => {
        const queryParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            queryParams.append(key, value);
          }
        });
        return `?${queryParams.toString()}`;
      },
      transformResponse: (response) => {
        return response.success ? response.data : [];
      },
      providesTags: ['Product'],
    }),
    getProduct: builder.query({
      query: (id) => `/${id}`,
      transformResponse: (response) => {
        return response.success ? response.data : null;
      },
      providesTags: (result, error, id) => [{ type: 'Product', id }],
    }),
    getCategories: builder.query({
      query: () => '/categories',
      transformResponse: (response) => {
        return response.success ? response.data : [];
      },
      providesTags: ['Product'],
    }),
  }),
});

export const { 
  useGetProductsQuery, 
  useGetProductQuery, 
  useGetCategoriesQuery 
} = productsApi;