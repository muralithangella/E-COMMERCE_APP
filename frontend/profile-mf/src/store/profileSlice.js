import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { usersAPI, ordersAPI } from '../../../shared/services/api'

export const fetchProfile = createAsyncThunk(
  'profile/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await usersAPI.getProfile()
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch profile')
    }
  }
)

export const updateProfile = createAsyncThunk(
  'profile/updateProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await usersAPI.updateProfile(profileData)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update profile')
    }
  }
)

export const fetchAddresses = createAsyncThunk(
  'profile/fetchAddresses',
  async (_, { rejectWithValue }) => {
    try {
      const response = await usersAPI.getAddresses()
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch addresses')
    }
  }
)

export const addAddress = createAsyncThunk(
  'profile/addAddress',
  async (addressData, { rejectWithValue }) => {
    try {
      const response = await usersAPI.addAddress(addressData)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add address')
    }
  }
)

export const updateAddress = createAsyncThunk(
  'profile/updateAddress',
  async ({ addressId, addressData }, { rejectWithValue }) => {
    try {
      const response = await usersAPI.updateAddress(addressId, addressData)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update address')
    }
  }
)

export const deleteAddress = createAsyncThunk(
  'profile/deleteAddress',
  async (addressId, { rejectWithValue }) => {
    try {
      await usersAPI.deleteAddress(addressId)
      return addressId
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete address')
    }
  }
)

export const fetchOrderHistory = createAsyncThunk(
  'profile/fetchOrderHistory',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await ordersAPI.getOrders(params)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch orders')
    }
  }
)

const profileSlice = createSlice({
  name: 'profile',
  initialState: {
    user: null,
    addresses: [],
    orders: [],
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
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(updateProfile.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(fetchOrderHistory.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchOrderHistory.fulfilled, (state, action) => {
        state.loading = false
        state.orders = action.payload
      })
      .addCase(fetchOrderHistory.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(fetchAddresses.fulfilled, (state, action) => {
        state.addresses = action.payload
      })
      .addCase(addAddress.fulfilled, (state, action) => {
        state.addresses.push(action.payload)
      })
      .addCase(updateAddress.fulfilled, (state, action) => {
        const index = state.addresses.findIndex(addr => addr._id === action.payload._id)
        if (index !== -1) {
          state.addresses[index] = action.payload
        }
      })
      .addCase(deleteAddress.fulfilled, (state, action) => {
        state.addresses = state.addresses.filter(addr => addr._id !== action.payload)
      })
  },
})

export const { clearError } = profileSlice.actions
export default profileSlice.reducer