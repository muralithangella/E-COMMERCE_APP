import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { ordersAPI, paymentsAPI } from '../../../shared/services/api'

export const processPayment = createAsyncThunk(
  'checkout/processPayment',
  async (paymentData, { rejectWithValue }) => {
    try {
      const response = await paymentsAPI.createPayment(paymentData)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Payment failed')
    }
  }
)

export const createOrder = createAsyncThunk(
  'checkout/createOrder',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState().checkout
      const orderData = {
        items: state.orderSummary.items,
        shippingAddress: state.shippingAddress,
        billingAddress: state.useSameAddress ? state.shippingAddress : state.billingAddress,
        payment: {
          method: state.paymentMethod.type,
          ...state.paymentMethod
        },
        pricing: {
          subtotal: state.orderSummary.subtotal,
          shipping: state.orderSummary.shipping,
          tax: state.orderSummary.tax,
          total: state.orderSummary.total
        }
      }
      const response = await ordersAPI.createOrder(orderData)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Order creation failed')
    }
  }
)

const initialState = {
  shippingAddress: {
    firstName: '',
    lastName: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    phone: ''
  },
  billingAddress: {
    firstName: '',
    lastName: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: ''
  },
  paymentMethod: {
    type: 'card',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: ''
  },
  orderSummary: {
    items: [],
    subtotal: 0,
    shipping: 0,
    tax: 0,
    total: 0
  },
  currentStep: 1,
  isLoading: false,
  error: null,
  orderId: null,
  useSameAddress: true
}

const checkoutSlice = createSlice({
  name: 'checkout',
  initialState,
  reducers: {
    updateShippingAddress: (state, action) => {
      state.shippingAddress = { ...state.shippingAddress, ...action.payload }
    },
    updateBillingAddress: (state, action) => {
      state.billingAddress = { ...state.billingAddress, ...action.payload }
    },
    updatePaymentMethod: (state, action) => {
      state.paymentMethod = { ...state.paymentMethod, ...action.payload }
    },
    updateOrderSummary: (state, action) => {
      state.orderSummary = { ...state.orderSummary, ...action.payload }
    },
    setCurrentStep: (state, action) => {
      state.currentStep = action.payload
    },
    toggleSameAddress: (state) => {
      state.useSameAddress = !state.useSameAddress
      if (state.useSameAddress) {
        state.billingAddress = { ...state.shippingAddress }
      }
    },
    clearError: (state) => {
      state.error = null
    },
    resetCheckout: (state) => {
      return { ...initialState }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(processPayment.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(processPayment.fulfilled, (state, action) => {
        state.isLoading = false
      })
      .addCase(processPayment.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      .addCase(createOrder.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.isLoading = false
        state.orderId = action.payload._id || action.payload.orderNumber
        state.currentStep = 4 // Move to confirmation step
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
  }
})

export const {
  updateShippingAddress,
  updateBillingAddress,
  updatePaymentMethod,
  updateOrderSummary,
  setCurrentStep,
  toggleSameAddress,
  clearError,
  resetCheckout
} = checkoutSlice.actions

export default checkoutSlice.reducer