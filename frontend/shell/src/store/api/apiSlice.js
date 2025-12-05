import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseQuery = fetchBaseQuery({
  baseUrl: 'http://localhost:5000/api',
  credentials: 'include', // Include cookies in requests
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
} = apiSlice;