import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from './axiosBaseQuery';

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: axiosBaseQuery,
  tagTypes: ['Product', 'Category', 'Cart', 'Order', 'User', 'Auth'],
  endpoints: () => ({}),
});

export default baseApi;