import axios from 'axios';

const AUTH_STORAGE_KEY = 'auth_data';

/**
 * Axios instance configured with base URL and interceptors
 * for authentication and error handling.
 */
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request interceptor to attach auth token to requests
 */
apiClient.interceptors.request.use((config) => {
  const authDataString = localStorage.getItem(AUTH_STORAGE_KEY);
  
  if (authDataString) {
    try {
      const authData = JSON.parse(authDataString);
      if (authData?.token) {
        config.headers.Authorization = `Bearer ${authData.token}`;
      }
    } catch (error) {
      console.error('Failed to parse auth data from localStorage:', error);
    }
  }
  
  return config;
});

/**
 * Response interceptor for error handling
 */
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear auth data and redirect to login
      localStorage.removeItem(AUTH_STORAGE_KEY);
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export { apiClient, AUTH_STORAGE_KEY };
