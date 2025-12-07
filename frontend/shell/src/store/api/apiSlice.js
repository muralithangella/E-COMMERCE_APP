import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseQuery = fetchBaseQuery({
  baseUrl: '/api',
  credentials: 'include',
  prepareHeaders: (headers) => {
    headers.set('Content-Type', 'application/json');
    return headers;
  },
});

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery,
  tagTypes: ['Product', 'Cart', 'User', 'Category', 'Order'],
  endpoints: (builder) => ({
    // Product endpoints
    getProducts: builder.query({
      query: (params = {}) => ({
        url: '/products',
        params,
      }),
      transformResponse: (response) => {
        console.log('Products API response:', response);
        return response?.data || response?.products || (Array.isArray(response) ? response : []);
      },
      providesTags: ['Product'],
    }),
    getProduct: builder.query({
      query: (id) => `/products/${id}`,
      transformResponse: (response) => response?.data || response,
      providesTags: (result, error, id) => [{ type: 'Product', id }],
    }),
    
    // Category endpoints
    getCategories: builder.query({
      query: () => '/categories',
      transformResponse: (response) => {
        console.log('Categories API response:', response);
        return response?.data || response?.categories || (Array.isArray(response) ? response : []);
      },
      providesTags: ['Category'],
    }),
    
    // Cart endpoints
    getCart: builder.query({
      query: () => '/cart',
      transformResponse: (response) => {
        console.log('Cart API response:', response);
        return response?.data || response;
      },
      providesTags: ['Cart'],
    }),
    addToCartAPI: builder.mutation({
      query: ({ productId, quantity = 1 }) => ({
        url: '/cart/add',
        method: 'POST',
        body: { productId, quantity },
      }),
      invalidatesTags: ['Cart'],
    }),
    updateCartItem: builder.mutation({
      query: ({ id, quantity }) => ({
        url: `/cart/items/${id}`,
        method: 'PUT',
        body: { quantity },
      }),
      invalidatesTags: ['Cart'],
    }),
    removeFromCartAPI: builder.mutation({
      query: (id) => ({
        url: `/cart/items/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Cart'],
    }),
    clearCartAPI: builder.mutation({
      query: () => ({
        url: '/cart/clear',
        method: 'DELETE',
      }),
      invalidatesTags: ['Cart'],
    }),
    
    // Order endpoints
    createOrder: builder.mutation({
      query: (orderData) => ({
        url: '/orders',
        method: 'POST',
        body: orderData,
      }),
      invalidatesTags: ['Cart', 'Order'],
    }),
    getOrders: builder.query({
      query: () => '/orders',
      transformResponse: (response) => response?.data || response,
      providesTags: ['Order'],
    }),
    getOrder: builder.query({
      query: (id) => `/orders/${id}`,
      transformResponse: (response) => response?.data || response,
      providesTags: (result, error, id) => [{ type: 'Order', id }],
    }),
    
    // Auth endpoints
    login: builder.mutation({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      transformResponse: (response) => response,
    }),
    register: builder.mutation({
      query: (userData) => ({
        url: '/auth/register',
        method: 'POST',
        body: userData,
      }),
      transformResponse: (response) => response,
    }),
    logout: builder.mutation({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
    }),
    
    // Search and recommendations
    getDeals: builder.query({
      query: () => '/deals',
      transformResponse: (response) => {
        console.log('Deals API response:', response);
        return response?.data || (Array.isArray(response) ? response : []);
      },
      providesTags: ['Product'],
    }),
    getRecommendations: builder.query({
      query: () => '/recommendations', 
      transformResponse: (response) => {
        console.log('Recommendations API response:', response);
        return response?.data || (Array.isArray(response) ? response : []);
      },
      providesTags: ['Product'],
    }),
    searchProducts: builder.query({
      query: (searchTerm) => ({
        url: '/search/suggestions',
        params: { q: searchTerm },
      }),
      transformResponse: (response) => response?.data || response,
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductQuery,
  useGetCategoriesQuery,
  useGetCartQuery,
  useAddToCartAPIMutation,
  useUpdateCartItemMutation,
  useRemoveFromCartAPIMutation,
  useClearCartAPIMutation,
  useCreateOrderMutation,
  useGetOrdersQuery,
  useGetOrderQuery,
  useGetDealsQuery,
  useGetRecommendationsQuery,
  useSearchProductsQuery,
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
} = apiSlice;