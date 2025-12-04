import React, { useState } from 'react';
import { useDebounce } from '../hooks/useDebounce';
import { useProductSearch } from '../hooks/useProducts';

const SearchBar = ({ onResults }) => {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);
  const { products, isLoading, search } = useProductSearch();

  React.useEffect(() => {
    if (debouncedQuery) {
      search(debouncedQuery);
    }
  }, [debouncedQuery, search]);

  React.useEffect(() => {
    onResults?.(products);
  }, [products, onResults]);

  return (
    <div style={{ marginBottom: '20px' }}>
      <input
        type="text"
        placeholder="Search products..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{
          width: '100%',
          padding: '12px',
          border: '1px solid #ddd',
          borderRadius: '4px',
          fontSize: '16px'
        }}
      />
      {isLoading && <div style={{ marginTop: '8px', color: '#666' }}>Searching...</div>}
    </div>
  );
};

export default SearchBar;