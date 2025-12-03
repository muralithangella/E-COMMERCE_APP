import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('http://localhost:5000/api/cart')
      if (!response.ok) throw new Error('Failed to fetch cart')
      const data = await response.json()
      console.log('Cart data received:', data)
      return data
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch cart')
    }
  }
)

export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async ({ productId, quantity = 1, variant = null }, { rejectWithValue }) => {
    try {
      const response = await cartAPI.addToCart(productId, quantity, variant)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add item')
    }
  }
)

export const updateCartItem = createAsyncThunk(
  'cart/updateCartItem',
  async ({ itemId, quantity }, { rejectWithValue }) => {
    try {
      const response = await cartAPI.updateCartItem(itemId, quantity)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update item')
    }
  }
)

export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async (itemId, { rejectWithValue }) => {
    try {
      await cartAPI.removeFromCart(itemId)
      return itemId
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to remove item')
    }
  }
)

export const clearCart = createAsyncThunk(
  'cart/clearCart',
  async (_, { rejectWithValue }) => {
    try {
      await cartAPI.clearCart()
      return true
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to clear cart')
    }
  }
)

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    totalItems: 0,
    totalPrice: 0,
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload.items || []
        state.totalPrice = action.payload.totalPrice || 0
        state.totalItems = action.payload.totalItems || 0
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.items = action.payload.items || []
        state.totalPrice = action.payload.totalPrice || 0
        state.totalItems = action.payload.totalItems || 0
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.items = action.payload.items || []
        state.totalPrice = action.payload.totalPrice || 0
        state.totalItems = action.payload.totalItems || 0
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item.productId !== action.payload)
        state.totalPrice = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
        state.totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0)
      })
      .addCase(clearCart.fulfilled, (state) => {
        state.items = []
        state.totalPrice = 0
        state.totalItems = 0
        state.loading = false
        state.error = null
      })
  },
})

export const { clearError } = cartSlice.actions
export default cartSlice.reducer