export { default as api } from '../../../shared/services/api';
export { authApi, useLoginMutation, useRegisterMutation, useForgotPasswordMutation, useResetPasswordMutation } from '../../../shared/services/authApi';

// Legacy API for backward compatibility
export const authAPI = {
  login: (email, password) => api.post('/api/auth/login', { email, password }),
  register: (name, email, password) => api.post('/api/auth/register', { name, email, password }),
  forgotPassword: (email) => api.post('/api/auth/forgot-password', { email }),
  resetPassword: (token, password) => api.post('/api/auth/reset-password', { token, password })
};