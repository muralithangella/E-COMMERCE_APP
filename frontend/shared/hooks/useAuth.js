import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { authAPI } from '../services/api';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, token, isAuthenticated, loading } = useSelector(state => state.auth);

  const login = async (credentials) => {
    try {
      const response = await authAPI.login(credentials);
      localStorage.setItem('accessToken', response.data.token);
      localStorage.setItem('refreshToken', response.data.refreshToken);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    dispatch({ type: 'auth/logout' });
  };

  const isLoggedIn = () => {
    return isAuthenticated && token;
  };

  const hasRole = (role) => {
    return user?.role === role;
  };

  return {
    user,
    token,
    isAuthenticated,
    loading,
    login,
    logout,
    isLoggedIn,
    hasRole
  };
};