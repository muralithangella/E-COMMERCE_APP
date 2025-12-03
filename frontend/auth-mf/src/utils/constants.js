export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'
export const MAIN_APP_URL = import.meta.env.VITE_MAIN_APP_URL || 'http://localhost:3000'

export const AUTH_ENDPOINTS = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password'
}

export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user'
}