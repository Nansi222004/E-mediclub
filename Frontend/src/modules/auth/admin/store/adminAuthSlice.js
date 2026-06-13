import { createSlice } from '@reduxjs/toolkit';

// Retrieve values from localStorage to support persistency
const storedAdminUser = localStorage.getItem('em_admin_user') 
  ? JSON.parse(localStorage.getItem('em_admin_user')) 
  : null;
const storedAdminToken = localStorage.getItem('em_admin_token') || null;

const initialState = {
  adminUser: storedAdminUser,
  adminToken: storedAdminToken,
  isAuthenticated: !!storedAdminToken,
  loading: false,
  error: null,
  otpSent: false,
  otpVerificationPending: false,
  tempEmail: null,
  tempToken: null,
  tempUser: null,
};

const adminAuthSlice = createSlice({
  name: 'adminAuth',
  initialState,
  reducers: {
    adminLoginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    adminLoginSuccess: (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.adminUser = action.payload.user;
      state.adminToken = action.payload.token;
      state.error = null;
      localStorage.setItem('em_admin_user', JSON.stringify(state.adminUser));
      localStorage.setItem('em_admin_token', state.adminToken);
    },
    adminLoginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    adminSendOtpSuccess: (state, action) => {
      state.loading = false;
      state.otpSent = true;
      state.otpVerificationPending = true;
      if (action.payload && typeof action.payload === 'object') {
        state.tempEmail = action.payload.email;
        state.tempToken = action.payload.tempToken;
        state.tempUser = action.payload.tempUser;
      } else {
        state.tempEmail = action.payload;
      }
    },
    adminVerifyOtpSuccess: (state, action) => {
      state.loading = false;
      state.otpSent = false;
      state.otpVerificationPending = false;
      state.isAuthenticated = true;
      state.adminUser = action.payload.user;
      state.adminToken = action.payload.token;
      state.tempEmail = null;
      state.tempToken = null;
      state.tempUser = null;
      localStorage.setItem('em_admin_user', JSON.stringify(state.adminUser));
      localStorage.setItem('em_admin_token', state.adminToken);
    },
    adminLogout: (state) => {
      state.adminUser = null;
      state.adminToken = null;
      state.isAuthenticated = false;
      state.otpSent = false;
      state.otpVerificationPending = false;
      state.tempEmail = null;
      state.tempToken = null;
      state.tempUser = null;
      localStorage.removeItem('em_admin_user');
      localStorage.removeItem('em_admin_token');
    }
  }
});

export const {
  adminLoginStart,
  adminLoginSuccess,
  adminLoginFailure,
  adminSendOtpSuccess,
  adminVerifyOtpSuccess,
  adminLogout
} = adminAuthSlice.actions;

export default adminAuthSlice.reducer;
