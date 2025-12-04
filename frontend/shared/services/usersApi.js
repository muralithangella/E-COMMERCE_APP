import { baseApi } from './baseApi';

export const usersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProfile: builder.query({
      query: () => ({ url: '/users/profile' }),
      providesTags: ['User'],
    }),
    updateProfile: builder.mutation({
      query: (profileData) => ({
        url: '/users/profile',
        method: 'PUT',
        data: profileData,
      }),
      invalidatesTags: ['User'],
    }),
    getAddresses: builder.query({
      query: () => ({ url: '/users/addresses' }),
      providesTags: ['User'],
    }),
    addAddress: builder.mutation({
      query: (address) => ({
        url: '/users/addresses',
        method: 'POST',
        data: address,
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

export const {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useGetAddressesQuery,
  useAddAddressMutation,
} = usersApi;