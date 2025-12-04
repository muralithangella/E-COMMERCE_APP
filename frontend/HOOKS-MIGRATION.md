# Hooks Migration Guide

## Overview
All micro-frontends now use React hooks extensively for:
- State management with custom hooks
- API calls with RTK Query hooks
- Reusable component logic
- Side effects and lifecycle management

## Key Changes

### 1. Custom Hooks Created
- `useCart()` - Complete cart management
- `useProducts()` - Product fetching and filtering
- `useProduct(id)` - Single product fetching
- `useProductSearch()` - Product search functionality

### 2. Component Simplification
Components now use hooks instead of:
- Class components → Function components with hooks
- Direct API calls → RTK Query hooks
- Redux actions → Custom hooks with mutations
- Manual state management → Built-in hook state

## Hook Usage Examples

### useCart Hook
```javascript
import { useCart } from '../../../shared/hooks/useCart';

const CartComponent = () => {
  const { 
    items, 
    total, 
    isLoading, 
    addToCart, 
    removeItem, 
    clearCart 
  } = useCart();

  return (
    <div>
      {items.map(item => (
        <div key={item.id}>
          {item.name}
          <button onClick={() => removeItem(item.id)}>Remove</button>
        </div>
      ))}
      <button onClick={() => clearCart()}>Clear Cart</button>
    </div>
  );
};
```

### useProducts Hook
```javascript
import { useProducts } from '../../../shared/hooks/useProducts';

const ProductsComponent = () => {
  const { products, isLoading, updateFilters } = useProducts();

  const handleFilterChange = (category) => {
    updateFilters({ category });
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};
```

### useProductSearch Hook
```javascript
import { useProductSearch } from '../../../shared/hooks/useProducts';

const SearchComponent = () => {
  const { products, isLoading, search } = useProductSearch();

  const handleSearch = (query) => {
    search(query, { category: 'electronics' });
  };

  return (
    <div>
      <input onChange={(e) => handleSearch(e.target.value)} />
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};
```

## Component Updates

### Before (Class Component):
```javascript
class ProductList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
      loading: true,
      error: null
    };
  }

  async componentDidMount() {
    try {
      const response = await fetch('/api/products');
      const products = await response.json();
      this.setState({ products, loading: false });
    } catch (error) {
      this.setState({ error, loading: false });
    }
  }

  render() {
    const { products, loading, error } = this.state;
    if (loading) return <div>Loading...</div>;
    return <div>{/* render products */}</div>;
  }
}
```

### After (Function Component with Hooks):
```javascript
const ProductList = () => {
  const { products, isLoading, error } = useProducts();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};
```

## Reusable Components with Hooks

### ProductCard Component
```javascript
const ProductCard = ({ product }) => {
  const { addToCart, isAdding } = useCart();

  return (
    <div>
      <h3>{product.name}</h3>
      <p>${product.price}</p>
      <button 
        onClick={() => addToCart(product.id)}
        disabled={isAdding}
      >
        {isAdding ? 'Adding...' : 'Add to Cart'}
      </button>
    </div>
  );
};
```

### SearchBar Component
```javascript
const SearchBar = ({ onResults }) => {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);
  const { products, search } = useProductSearch();

  useEffect(() => {
    if (debouncedQuery) {
      search(debouncedQuery);
    }
  }, [debouncedQuery, search]);

  useEffect(() => {
    onResults?.(products);
  }, [products, onResults]);

  return (
    <input
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      placeholder="Search products..."
    />
  );
};
```

## Benefits Achieved

1. **Simplified Components**: Less boilerplate code
2. **Reusable Logic**: Custom hooks can be shared across components
3. **Better Performance**: Automatic memoization and optimization
4. **Cleaner Code**: Separation of concerns between UI and logic
5. **Type Safety**: Better TypeScript support with hooks
6. **Testing**: Easier to test hook logic separately from UI

## Migration Checklist

- ✅ All class components converted to function components
- ✅ All direct API calls replaced with RTK Query hooks
- ✅ Custom hooks created for common patterns
- ✅ Reusable components use hooks for logic
- ✅ State management simplified with hooks
- ✅ Side effects managed with useEffect
- ✅ Performance optimized with useMemo/useCallback where needed