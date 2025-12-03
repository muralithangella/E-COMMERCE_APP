import { baseApi } from './baseApi';

export const cartApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCart: builder.query({
      query: () => '/cart',
      providesTags: ['Cart'],
    }),
    
    addToCart: builder.mutation({
      query: ({ productId, quantity = 1, variant }) => ({
        url: '/cart/add',
        method: 'POST',
        body: { productId, quantity, variant }
      }),
      invalidatesTags: ['Cart'],
    }),
    
    updateCartItem: builder.mutation({
      query: ({ itemId, quantity }) => ({
        url: `/cart/items/${itemId}`,
        method: 'PUT',
        body: { quantity }
      }),
      invalidatesTags: ['Cart'],
    }),
    
    removeFromCart: builder.mutation({
      query: (itemId) => ({
        url: `/cart/items/${itemId}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['Cart'],
    }),
    
    clearCart: builder.mutation({
      query: () => ({
        url: '/cart/clear',
        method: 'DELETE'
      }),
      invalidatesTags: ['Cart'],
    }),
  }),
});

export const {
  useGetCartQuery,
  useAddToCartMutation,
  useUpdateCartItemMutation,
  useRemoveFromCartMutation,
  useClearCartMutation,
} = cartApi;