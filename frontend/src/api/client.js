import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request Interceptor: Attach Bearer Token from localStorage if present
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken') || localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle 401 Unauthorized automatically
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear invalid/expired authentication state
      localStorage.removeItem('adminToken');
      localStorage.removeItem('token');
      localStorage.removeItem('adminUser');

      // Only redirect if currently on a protected admin page and not already on the login page
      const currentPath = window.location.pathname;
      if (currentPath.startsWith('/admin') && currentPath !== '/admin/login') {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
