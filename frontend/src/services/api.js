import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
});

// Attach Authorization header if JWT token is stored
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('medicare_token') || localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 token expiry gracefully
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If unauthorized on protected route, optionally clear
      // but let callers handle error message
    }
    return Promise.reject(error);
  }
);

export default api;
