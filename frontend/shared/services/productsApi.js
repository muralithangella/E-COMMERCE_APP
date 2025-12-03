import { baseApi } from './baseApi';

export const productsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: (params = {}) => ({
        url: '/products',
        params: {
          page: params.page || 1,
          limit: params.limit || 20,
          category: params.category,
          search: params.search,
          minPrice: params.minPrice,
          maxPrice: params.maxPrice,
          sortBy: params.sortBy || 'createdAt',
          sortOrder: params.sortOrder || 'desc'
        }
      }),
      providesTags: ['Product'],
    }),
    
    getProduct: builder.query({
      query: (id) => `/products/${id}`,
      providesTags: (result, error, id) => [{ type: 'Product', id }],
    }),
    
    getFeaturedProducts: builder.query({
      query: () => '/products/featured',
      providesTags: ['Product'],
    }),
    
    getDeals: builder.query({
      query: () => '/products/deals',
      providesTags: ['Product'],
    }),
    
    getCategories: builder.query({
      query: () => '/categories',
      providesTags: ['Category'],
    }),
    
    searchProducts: builder.query({
      query: (searchTerm) => ({
        url: '/products/search',
        params: { q: searchTerm }
      }),
      providesTags: ['Product'],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductQuery,
  useGetFeaturedProductsQuery,
  useGetDealsQuery,
  useGetCategoriesQuery,
  useSearchProductsQuery,
} = productsApi;