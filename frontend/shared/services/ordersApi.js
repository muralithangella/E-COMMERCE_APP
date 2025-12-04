import { baseApi } from './baseApi';

export const ordersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation({
      query: (orderData) => ({
        url: '/orders',
        method: 'POST',
        data: orderData,
      }),
      invalidatesTags: ['Order'],
    }),
    
    getOrder: builder.query({
      query: (orderId) => ({ url: `/orders/${orderId}` }),
      providesTags: (result, error, id) => [{ type: 'Order', id }],
    }),
    
    getOrders: builder.query({
      query: (params = {}) => ({
        url: '/orders',
        params: {
          page: params.page || 1,
          limit: params.limit || 10,
          status: params.status,
        }
      }),
      providesTags: ['Order'],
    }),
    
    updateOrderStatus: builder.mutation({
      query: ({ orderId, status }) => ({
        url: `/orders/${orderId}/status`,
        method: 'PATCH',
        data: { status },
      }),
      invalidatesTags: (result, error, { orderId }) => [{ type: 'Order', id: orderId }],
    }),
    
    cancelOrder: builder.mutation({
      query: (orderId) => ({
        url: `/orders/${orderId}/cancel`,
        method: 'PATCH',
      }),
      invalidatesTags: (result, error, orderId) => [{ type: 'Order', id: orderId }],
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useGetOrderQuery,
  useGetOrdersQuery,
  useUpdateOrderStatusMutation,
  useCancelOrderMutation,
} = ordersApi;