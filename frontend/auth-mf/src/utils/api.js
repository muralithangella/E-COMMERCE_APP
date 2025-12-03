import axios from 'axios'
import { API_BASE_URL, AUTH_ENDPOINTS } from './constants'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

export const authAPI = {
  login: (email, password) => 
    api.post(AUTH_ENDPOINTS.LOGIN, { email, password }),
  
  register: (name, email, password) => 
    api.post(AUTH_ENDPOINTS.REGISTER, { name, email, password }),
  
  forgotPassword: (email) => 
    api.post(AUTH_ENDPOINTS.FORGOT_PASSWORD, { email }),
  
  resetPassword: (token, password) => 
    api.post(AUTH_ENDPOINTS.RESET_PASSWORD, { token, password })
}