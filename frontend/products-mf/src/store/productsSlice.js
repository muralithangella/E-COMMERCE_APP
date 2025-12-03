import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { productsAPI, categoriesAPI } from '../../../shared/services/api'

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (params = {}) => {
    const response = await productsAPI.getProducts(params)
    return response.data
  }
)

export const searchProducts = createAsyncThunk(
  'products/searchProducts',
  async ({ query, filters = {} }) => {
    const response = await productsAPI.searchProducts(query, filters)
    return response.data
  }
)

export const fetchCategories = createAsyncThunk(
  'products/fetchCategories',
  async () => {
    const response = await categoriesAPI.getCategories()
    return response.data
  }
)

export const fetchProductById = createAsyncThunk(
  'products/fetchProductById',
  async (id) => {
    const response = await productsAPI.getProduct(id)
    return response.data
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
        state.error = action.error.message
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
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
        state.error = action.error.message
      })
  }
})

export const { clearCurrentProduct, setFilters, setPagination, clearError } = productsSlice.actions
export default productsSlice.reducer