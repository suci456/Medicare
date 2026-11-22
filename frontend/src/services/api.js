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

// Detect and reject invalid HTML responses (e.g. when SPA fallback returns index.html for missing /api routes)
api.interceptors.response.use(
  (response) => {
    if (
      typeof response.data === 'string' &&
      (response.data.trim().startsWith('<!DOCTYPE') ||
        response.data.trim().startsWith('<html') ||
        response.data.trim().startsWith('<!doctype'))
    ) {
      return Promise.reject(
        new Error(
          'API endpoint returned HTML instead of JSON. Verify backend is running and VITE_API_BASE_URL is configured.'
        )
      );
    }
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
