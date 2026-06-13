import axios from 'axios';
import store from '../../app/store';
import { refreshTokenSuccess, logout } from '../../modules/auth/store/authSlice';
import { adminLogout } from '../../modules/auth/admin/store/adminAuthSlice';
import { vendorLogout } from '../../modules/auth/vendor/store/vendorAuthSlice';

// Create base Axios instance
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001',
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
    let token = null;

    if (config.url && (config.url.includes('/api/admin') || config.url.includes('/admin/'))) {
      token = state.adminAuth?.adminToken || localStorage.getItem('em_admin_token');
    } else if (config.url && (config.url.includes('/api/vendor') || config.url.includes('/vendor/'))) {
      token = state.vendorAuth?.vendorToken || localStorage.getItem('em_vendor_token');
    } else {
      token = state.auth?.token || localStorage.getItem('em_token');
    }

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

    // Check if error is 401
    if (error.response && error.response.status === 401) {
      const isApiAdmin = originalRequest.url && (originalRequest.url.includes('/api/admin') || originalRequest.url.includes('/admin/'));
      const isApiVendor = originalRequest.url && (originalRequest.url.includes('/api/vendor') || originalRequest.url.includes('/vendor/'));

      if (isApiAdmin) {
        // Clear admin auth state
        store.dispatch(adminLogout());
        localStorage.removeItem('em_admin_token');
        localStorage.removeItem('em_admin_user');
        
        // Redirect to admin login page
        if (typeof window !== 'undefined') {
          window.location.href = '/admin/login';
        }
        return Promise.reject(error);
      }

      if (isApiVendor) {
        // Clear vendor auth state
        store.dispatch(vendorLogout());
        localStorage.removeItem('em_vendor_token');
        localStorage.removeItem('em_vendor_user');
        
        // Redirect to vendor login page
        if (typeof window !== 'undefined') {
          window.location.href = '/vendor/auth';
        }
        return Promise.reject(error);
      }

      // Standard user token refresh flow
      if (
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
          const storedRefreshToken = localStorage.getItem('em_refresh_token');
          const response = await axios.post(
            `${import.meta.env.VITE_API_URL}/api/auth/refresh`,
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
    }

    return Promise.reject(error);
  }
);

export default apiClient;
