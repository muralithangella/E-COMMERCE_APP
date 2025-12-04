import { configureStore } from '@reduxjs/toolkit';
import { baseApi } from '../services/baseApi';
import authSlice from './authSlice';

export const createStore = (additionalReducers = {}) => {
  return configureStore({
    reducer: {
      [baseApi.reducerPath]: baseApi.reducer,
      auth: authSlice,
      ...additionalReducers,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(baseApi.middleware),
  });
};

export { baseApi } from '../services/baseApi';
export { default as authSlice } from './authSlice';