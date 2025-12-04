import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

const API_BASE = 'http://localhost:5000/api'

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (params = {}, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams(params).toString()
      const response = await fetch(`${API_BASE}/products?${queryParams}`)
      if (!response.ok) throw new Error('Failed to fetch products')
      const data = await response.json()
      return data.data || data
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const searchProducts = createAsyncThunk(
  'products/searchProducts',
  async ({ query, filters = {} }, { rejectWithValue }) => {
    try {
      const params = { search: query, ...filters }
      const queryParams = new URLSearchParams(params).toString()
      const response = await fetch(`${API_BASE}/products?${queryParams}`)
      if (!response.ok) throw new Error('Failed to search products')
      const data = await response.json()
      return data.data || data
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const fetchCategories = createAsyncThunk(
  'products/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE}/categories`)
      if (!response.ok) throw new Error('Failed to fetch categories')
      const data = await response.json()
      return data.data || data.categories || data
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const fetchProductById = createAsyncThunk(
  'products/fetchProductById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE}/products/${id}`)
      if (!response.ok) throw new Error('Failed to fetch product')
      const data = await response.json()
      return data.data || data
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

const productsSlice = createSlice({
  name: 'products',
  initialState: {
    products: [],
    currentProduct: null,
    categories: [],
    filters: {
      category: '',
      priceRange: [0, 1000],
      brand: '',
      rating: 0
    },
    pagination: {
      page: 1,
      limit: 12,
      total: 0,
      totalPages: 0
    },
    loading: false,
    error: null
  },
  reducers: {
    clearCurrentProduct: (state) => {
      state.currentProduct = null
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload }
    },
    setPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload }
    },
    clearError: (state) => {
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false
        state.products = action.payload.products || action.payload
        if (action.payload.pagination) {
          state.pagination = action.payload.pagination
        }
      })
      .addCase(searchProducts.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(searchProducts.fulfilled, (state, action) => {
        state.loading = false
        state.products = action.payload.products || action.payload
        if (action.payload.pagination) {
          state.pagination = action.payload.pagination
        }
      })
      .addCase(searchProducts.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false
        state.categories = action.payload
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false
        state.currentProduct = action.payload
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  }
})

export const { clearCurrentProduct, setFilters, setPagination, clearError } = productsSlice.actions
export default productsSlice.reducer