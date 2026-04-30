import axios from 'axios';
import { getToken, isTokenValid, clearToken } from '../utils/tokenManager.js';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 30000 // 30 seconds timeout
});

// Request interceptor: attach token if present
API.interceptors.request.use((config) => {
  const token = getToken();
  if (token && isTokenValid()) {
    config.headers.Authorization = `Bearer ${token}`;
  } else if (token && !isTokenValid()) {
    // Token exists but is invalid, clear it
    clearToken();
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response interceptor: handle auth errors
API.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      clearToken();
      // Redirect to login
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    
    // Handle 403 Forbidden
    if (error.response?.status === 403) {
      console.error('Access forbidden:', error.response.data);
    }
    
    return Promise.reject(error);
  }
);

export default API;