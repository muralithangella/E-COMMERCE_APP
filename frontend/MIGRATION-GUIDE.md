# API Migration Guide: Fetch to Axios + RTK Query

## Overview
All frontend micro-services now use:
- **Axios** with centralized interceptors for HTTP requests
- **RTK Query** for API caching and state management
- Centralized API configuration in `shared/services/`

## Key Changes

### 1. Centralized Axios Configuration
- All API calls use the shared axios instance with interceptors
- Automatic token refresh and error handling
- Security headers and request timestamps

### 2. RTK Query Integration
- Automatic caching and invalidation
- Optimistic updates
- Background refetching
- Loading and error states

## Migration Examples

### Before (fetch):
```javascript
const fetchProducts = async () => {
  const response = await fetch('/api/products');
  const data = await response.json();
  return data;
};
```

### After (RTK Query):
```javascript
import { useGetProductsQuery } from '../../../shared/services/productsApi';

const ProductsList = () => {
  const { data: products, isLoading, error } = useGetProductsQuery();
  
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return (
    <div>
      {products?.map(product => (
        <div key={product.id}>{product.name}</div>
      ))}
    </div>
  );
};
```

### Before (axios direct):
```javascript
import axios from 'axios';

const addToCart = async (productId, quantity) => {
  const response = await axios.post('/api/cart/add', { productId, quantity });
  return response.data;
};
```

### After (RTK Query):
```javascript
import { useAddToCartMutation } from '../../../shared/services/cartApi';

const AddToCartButton = ({ productId }) => {
  const [addToCart, { isLoading }] = useAddToCartMutation();
  
  const handleAddToCart = async () => {
    try {
      await addToCart({ productId, quantity: 1 }).unwrap();
      // Cart will automatically refetch due to cache invalidation
    } catch (error) {
      console.error('Failed to add to cart:', error);
    }
  };
  
  return (
    <button onClick={handleAddToCart} disabled={isLoading}>
      {isLoading ? 'Adding...' : 'Add to Cart'}
    </button>
  );
};
```

## Available RTK Query Hooks

### Products API
- `useGetProductsQuery(params)`
- `useGetProductQuery(id)`
- `useSearchProductsQuery({ query, filters })`

### Cart API
- `useGetCartQuery()`
- `useAddToCartMutation()`
- `useUpdateCartItemMutation()`
- `useRemoveFromCartMutation()`
- `useClearCartMutation()`

### Auth API
- `useLoginMutation()`
- `useRegisterMutation()`
- `useForgotPasswordMutation()`
- `useResetPasswordMutation()`

### Orders API
- `useGetOrdersQuery(params)`
- `useGetOrderQuery(id)`
- `useCreateOrderMutation()`

## Store Setup

Each micro-frontend should use the shared store configuration:

```javascript
import { createStore } from '../../../shared/store';
import { Provider } from 'react-redux';

// Create store with additional reducers if needed
const store = createStore({
  // Add micro-frontend specific reducers here
});

const App = () => (
  <Provider store={store}>
    <YourApp />
  </Provider>
);
```

## Legacy Support

All micro-frontends still export legacy API objects for backward compatibility:
- `productsAPI`
- `cartAPI` 
- `authAPI`
- `checkoutAPI`
- `profileAPI`

These use the centralized axios instance with interceptors.

## Benefits

1. **Automatic Caching**: No more manual cache management
2. **Optimistic Updates**: UI updates immediately, rolls back on error
3. **Background Refetching**: Data stays fresh automatically
4. **Loading States**: Built-in loading and error handling
5. **Request Deduplication**: Multiple identical requests are automatically deduplicated
6. **Centralized Configuration**: All API configuration in one place