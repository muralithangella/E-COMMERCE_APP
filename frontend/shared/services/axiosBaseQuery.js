import api from './api';

export const axiosBaseQuery = async ({ url, method = 'GET', data, params }) => {
  try {
    const result = await api({
      url,
      method,
      data,
      params,
    });
    return { data: result.data };
  } catch (axiosError) {
    return {
      error: {
        status: axiosError.response?.status,
        data: axiosError.response?.data || axiosError.message,
      },
    };
  }
};