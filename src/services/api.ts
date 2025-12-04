import axios, { type AxiosError } from 'axios';

// API Base URL - .env faylından gəlməlidir
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5034/api';

// Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Admin token əlavə etmək üçün
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('admin-token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Error handling
api.interceptors.response.use(
  (response) => {
    // Backend returns {success: true, data: [...]}
    if (response.data && response.data.success !== undefined) {
      return response.data.data;
    }
    return response.data;
  },
  (error) => {
    const axiosError = error as AxiosError;

    if (axiosError.response?.status === 401) {
      localStorage.removeItem('admin-token');
      if (window.location.pathname.startsWith('/admin')) {
        window.location.href = '/admin/login';
      }
    }

    return Promise.reject({
      status: axiosError.response?.status,
      data: axiosError.response?.data ?? null,
      message:
        (axiosError.response?.data as { message?: string } | undefined)?.message ||
        axiosError.message,
      request: axiosError.request,
      response: axiosError.response,
    });
  }
);

export default api;
