import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// API calls for server-side cart
const cartAPI = {
  getCart: async () => {
    const response = await fetch('http://localhost:8081/api/cart', {
      credentials: 'include',
      headers: { 'Authorization': `Bearer ${sessionStorage.getItem('token')}` }
    });
    return response.json();
  },
  
  addItem: async (item) => {
    const response = await fetch('http://localhost:8081/api/cart/add', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionStorage.getItem('token')}`
      },
      credentials: 'include',
      body: JSON.stringify(item)
    });
    return response.json();
  },
  
  updateItem: async (id, quantity) => {
    const response = await fetch(`http://localhost:8081/api/cart/items/${id}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionStorage.getItem('token')}`
      },
      credentials: 'include',
      body: JSON.stringify({ quantity })
    });
    return response.json();
  },
  
  removeItem: async (id) => {
    const response = await fetch(`http://localhost:8081/api/cart/items/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${sessionStorage.getItem('token')}` },
      credentials: 'include'
    });
    return response.json();
  }
};

// Async thunks
export const fetchCart = createAsyncThunk('cart/fetch', async () => {
  return await cartAPI.getCart();
});

export const addToCart = createAsyncThunk('cart/add', async (item) => {
  return await cartAPI.addItem(item);
});

export const updateCartItem = createAsyncThunk('cart/update', async ({ id, quantity }) => {
  return await cartAPI.updateItem(id, quantity);
});

export const removeFromCart = createAsyncThunk('cart/remove', async (id) => {
  return await cartAPI.removeItem(id);
});

const secureCartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    total: 0,
    count: 0,
    loading: false,
    error: null
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.items = action.payload.items || [];
        state.total = action.payload.total || 0;
        state.count = action.payload.count || 0;
        state.loading = false;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.items = action.payload.items;
        state.total = action.payload.total;
        state.count = action.payload.count;
        state.loading = false;
      })
      .addMatcher(
        (action) => action.type.endsWith('/pending'),
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addMatcher(
        (action) => action.type.endsWith('/rejected'),
        (state, action) => {
          state.loading = false;
          state.error = action.error.message;
        }
      );
  }
});

export const { clearError } = secureCartSlice.actions;
export default secureCartSlice.reducer;