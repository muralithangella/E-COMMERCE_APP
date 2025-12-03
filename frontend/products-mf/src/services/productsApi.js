import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const productsApi = createApi({
  reducerPath: 'productsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:5000/api/products',
  }),
  tagTypes: ['Product'],
  endpoints: (builder) => ({
    getProducts: builder.query({
      queryFn: async () => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockProducts = [
          {
            id: 1,
            name: 'MacBook Pro 16-inch',
            price: 2399.99,
            originalPrice: 2599.99,
            category: 'Electronics',
            brand: 'Apple',
            rating: 4.8,
            reviewCount: 1247,
            image: 'https://picsum.photos/400/300?random=1',
            description: 'Apple MacBook Pro with M2 Pro chip, 16GB RAM, 512GB SSD',
            inStock: true,
            stockCount: 15,
            discount: 8,
            freeShipping: true,
            prime: true
          },
          {
            id: 2,
            name: 'Sony WH-1000XM5 Wireless Headphones',
            price: 349.99,
            originalPrice: 399.99,
            category: 'Electronics',
            brand: 'Sony',
            rating: 4.6,
            reviewCount: 892,
            image: 'https://picsum.photos/400/300?random=2',
            description: 'Industry-leading noise canceling headphones',
            inStock: true,
            stockCount: 8,
            discount: 12,
            freeShipping: true,
            prime: true
          },
          {
            id: 3,
            name: 'Apple Watch Series 9',
            price: 429.99,
            originalPrice: 449.99,
            category: 'Electronics',
            brand: 'Apple',
            rating: 4.7,
            reviewCount: 2156,
            image: 'https://picsum.photos/400/300?random=3',
            description: 'Advanced health monitoring and fitness tracking',
            inStock: true,
            stockCount: 23,
            discount: 4,
            freeShipping: true,
            prime: true
          }
        ];
        
        return { data: mockProducts };
      },
      providesTags: ['Product'],
    }),
  }),
});

export const { useGetProductsQuery } = productsApi;