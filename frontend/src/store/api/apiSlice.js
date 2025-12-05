import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_CONFIG, CACHE_KEYS } from '../../constants';

const baseQuery = fetchBaseQuery({
  baseUrl: `${API_CONFIG.BASE_URL}/api`,
  timeout: API_CONFIG.TIMEOUT,
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.token;
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    headers.set('Content-Type', 'application/json');
    return headers;
  },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  
  if (result.error && result.error.status === 401) {
    const refreshResult = await baseQuery('/auth/refresh', api, extraOptions);
    
    if (refreshResult.data) {
      api.dispatch(setCredentials(refreshResult.data));
      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(logout());
    }
  }
  
  return result;
};

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Product', 'Category', 'Cart', 'Order', 'User', 'Wishlist'],
  keepUnusedDataFor: API_CONFIG.CACHE_DURATION / 1000,
  endpoints: (builder) => ({
    // Products
    getProducts: builder.query({
      query: (params = {}) => ({
        url: '/products',
        params: {
          page: params.page || 1,
          limit: params.limit || 20,
          ...params,
        },
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({ type: 'Product', id })),
              { type: 'Product', id: 'LIST' },
            ]
          : [{ type: 'Product', id: 'LIST' }],
      transformResponse: (response) => ({
        products: response.data || [],
        pagination: response.pagination || {},
        filters: response.filters || {},
      }),
    }),

    getProductById: builder.query({
      query: (id) => `/products/${id}`,
      providesTags: (result, error, id) => [{ type: 'Product', id }],
      transformResponse: (response) => response.data,
    }),

    searchProducts: builder.query({
      query: (searchTerm) => ({
        url: '/products',
        params: { search: searchTerm },
      }),
      providesTags: [{ type: 'Product', id: 'SEARCH' }],
    }),

    getSearchSuggestions: builder.query({
      query: (query) => ({
        url: '/search/suggestions',
        params: { q: query },
      }),
      keepUnusedDataFor: 60, // 1 minute for suggestions
    }),

    // Categories
    getCategories: builder.query({
      query: () => '/categories',
      providesTags: [{ type: 'Category', id: 'LIST' }],
      transformResponse: (response) => response.data || [],
    }),

    // Cart
    getCart: builder.query({
      query: () => '/cart',
      providesTags: [{ type: 'Cart', id: 'LIST' }],
      transformResponse: (response) => response.data || { items: [], total: 0 },
    }),

    addToCart: builder.mutation({
      query: ({ productId, quantity = 1 }) => ({
        url: '/cart/add',
        method: 'POST',
        body: { productId, quantity },
      }),
      invalidatesTags: [{ type: 'Cart', id: 'LIST' }],
      onQueryStarted: async ({ productId, quantity }, { dispatch, queryFulfilled, getState }) => {
        const patchResult = dispatch(
          apiSlice.util.updateQueryData('getCart', undefined, (draft) => {
            const existingItem = draft.items.find(item => item.productId === productId);
            if (existingItem) {
              existingItem.quantity += quantity;
            } else {
              draft.items.push({ productId, quantity, id: Date.now() });
            }
            draft.total = draft.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
          })
        );
        
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),

    updateCartItem: builder.mutation({
      query: ({ id, quantity }) => ({
        url: `/cart/items/${id}`,
        method: 'PUT',
        body: { quantity },
      }),
      invalidatesTags: [{ type: 'Cart', id: 'LIST' }],
    }),

    removeFromCart: builder.mutation({
      query: (id) => ({
        url: `/cart/items/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Cart', id: 'LIST' }],
    }),

    // Wishlist
    getWishlist: builder.query({
      query: () => '/wishlist',
      providesTags: [{ type: 'Wishlist', id: 'LIST' }],
      transformResponse: (response) => response.data || [],
    }),

    addToWishlist: builder.mutation({
      query: ({ productId }) => ({
        url: '/wishlist/add',
        method: 'POST',
        body: { productId },
      }),
      invalidatesTags: [{ type: 'Wishlist', id: 'LIST' }],
    }),

    removeFromWishlist: builder.mutation({
      query: (productId) => ({
        url: `/wishlist/${productId}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Wishlist', id: 'LIST' }],
    }),

    // Orders
    getOrders: builder.query({
      query: (params = {}) => ({
        url: '/orders',
        params,
      }),
      providesTags: [{ type: 'Order', id: 'LIST' }],
      transformResponse: (response) => response.data || [],
    }),

    createOrder: builder.mutation({
      query: (orderData) => ({
        url: '/orders',
        method: 'POST',
        body: orderData,
      }),
      invalidatesTags: [{ type: 'Order', id: 'LIST' }, { type: 'Cart', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useSearchProductsQuery,
  useGetSearchSuggestionsQuery,
  useGetCategoriesQuery,
  useGetCartQuery,
  useAddToCartMutation,
  useUpdateCartItemMutation,
  useRemoveFromCartMutation,
  useGetWishlistQuery,
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
  useGetOrdersQuery,
  useCreateOrderMutation,
} = apiSlice;