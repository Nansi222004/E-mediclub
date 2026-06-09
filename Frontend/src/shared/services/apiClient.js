import axios from 'axios';
import store from '../../app/store';
import { refreshTokenSuccess, logout } from '../../modules/auth/store/authSlice';

// Create base Axios instance
const apiClient = axios.create({
  baseURL: 'http://localhost:5001',
  timeout: 15000,
  withCredentials: true, // Crucial for reading/writing HTTP-Only refresh cookies
});

// Queue to hold pending requests while token is refreshing
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Request interceptor: Attach authorization header & active location parameters
apiClient.interceptors.request.use(
  (config) => {
    // Read active token from Redux store (primary) or LocalStorage (fallback)
    const state = store.getState();
    const token = state.auth?.token || localStorage.getItem('em_token');

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    // Auto-inject location query parameters to all requests except location verification itself
    const location = state.products?.location;
    if (location && location.pincode && config.url && !config.url.includes('/api/location/')) {
      config.params = config.params || {};
      if (!config.params.pincode) {
        config.params.pincode = location.pincode;
      }
      if (!config.params.city) {
        config.params.city = location.city;
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor: Catch 401s and automatically refresh token
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check if error is 401, is not a retry, and is not a direct login/register request
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes('/api/auth/login') &&
      !originalRequest.url.includes('/api/auth/register')
    ) {
      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers['Authorization'] = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Attempt token refresh
        // Send refresh token if stored locally, or rely on cookies (withCredentials is true)
        const storedRefreshToken = localStorage.getItem('em_refresh_token');
        const response = await axios.post(
          'http://localhost:5000/api/auth/refresh',
          { refreshToken: storedRefreshToken },
          { withCredentials: true }
        );

        const { accessToken, refreshToken: newRefreshToken } = response.data.data;

        // Dispatch new token to Redux store
        store.dispatch(refreshTokenSuccess(accessToken));
        
        // Also update local storage values
        localStorage.setItem('em_token', accessToken);
        if (newRefreshToken) {
          localStorage.setItem('em_refresh_token', newRefreshToken);
        }

        // Process all queued requests with new token
        processQueue(null, accessToken);
        isRefreshing = false;

        // Retry original request
        originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        // If refresh fails, log out the user and clear auth state
        processQueue(refreshError, null);
        isRefreshing = false;
        store.dispatch(logout());
        localStorage.removeItem('em_token');
        localStorage.removeItem('em_refresh_token');
        
        // Redirect to login page if window is available
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
