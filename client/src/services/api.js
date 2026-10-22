import axios from 'axios';

const api = axios.create({
  baseURL: "/api",
  withCredentials: true, // Send HTTP-only session cookies with requests
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to add Bearer token as fallback if stored in localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('flowforge_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor to handle global 401 unauthorized responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token if server rejects authentication
      localStorage.removeItem('flowforge_token');
    }
    return Promise.reject(error);
  }
);

export default api;
