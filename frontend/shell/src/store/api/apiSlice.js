import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseQuery = fetchBaseQuery({
  baseUrl: 'http://localhost:5000/api',
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth?.token;
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery,
  tagTypes: ['Product', 'Cart', 'User', 'Category'],
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: (params = {}) => ({
        url: '/products',
        params,
      }),
      transformResponse: (response) => {
        console.log('Products API response:', response);
        return response?.data || response?.products || [];
      },
      providesTags: ['Product'],
    }),
    getCategories: builder.query({
      query: () => '/categories',
      transformResponse: (response) => {
        console.log('Categories API response:', response);
        return response?.data || response?.categories || [];
      },
      providesTags: ['Category'],
    }),
    getCart: builder.query({
      query: () => '/cart',
      transformResponse: (response) => {
        console.log('Cart API response:', response);
        return response?.data || response;
      },
      providesTags: ['Cart'],
    }),
    updateCartItem: builder.mutation({
      query: ({ id, quantity }) => ({
        url: `/cart/items/${id}`,
        method: 'PUT',
        body: { quantity },
      }),
      invalidatesTags: ['Cart'],
    }),
    removeFromCart: builder.mutation({
      query: (id) => ({
        url: `/cart/items/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Cart'],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetCategoriesQuery,
  useGetCartQuery,
  useUpdateCartItemMutation,
  useRemoveFromCartMutation,
} = apiSlice;