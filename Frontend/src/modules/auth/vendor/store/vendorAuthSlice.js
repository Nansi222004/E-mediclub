import { createSlice } from '@reduxjs/toolkit';

// Retrieve values from localStorage to support persistency
const storedVendorUser = localStorage.getItem('em_vendor_user') 
  ? JSON.parse(localStorage.getItem('em_vendor_user')) 
  : null;
const storedVendorToken = localStorage.getItem('em_vendor_token') || null;

const initialState = {
  vendorUser: storedVendorUser,
  vendorToken: storedVendorToken,
  isAuthenticated: !!storedVendorToken,
  loading: false,
  error: null,
  otpSent: false,
  otpVerificationPending: false,
  tempPhone: null,
  tempVendorData: null,
};

const vendorAuthSlice = createSlice({
  name: 'vendorAuth',
  initialState,
  reducers: {
    vendorAuthStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    vendorSendOtpSuccess: (state, action) => {
      state.loading = false;
      state.otpSent = true;
      state.otpVerificationPending = true;
      state.tempPhone = action.payload.phone;
      state.tempVendorData = action.payload.vendorData; // caches signup payload for validation
    },
    vendorVerifyOtpSuccess: (state, action) => {
      state.loading = false;
      state.otpSent = false;
      state.otpVerificationPending = false;
      state.isAuthenticated = true;
      state.vendorUser = action.payload.user;
      state.vendorToken = action.payload.token;
      state.tempPhone = null;
      state.tempVendorData = null;
      localStorage.setItem('em_vendor_user', JSON.stringify(state.vendorUser));
      localStorage.setItem('em_vendor_token', state.vendorToken);
    },
    vendorLoginSuccess: (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.vendorUser = action.payload.user;
      state.vendorToken = action.payload.token;
      state.error = null;
      localStorage.setItem('em_vendor_user', JSON.stringify(state.vendorUser));
      localStorage.setItem('em_vendor_token', state.vendorToken);
    },
    vendorAuthFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    vendorLogout: (state) => {
      state.vendorUser = null;
      state.vendorToken = null;
      state.isAuthenticated = false;
      state.otpSent = false;
      state.otpVerificationPending = false;
      localStorage.removeItem('em_vendor_user');
      localStorage.removeItem('em_vendor_token');
    },
    vendorUpdateKycStatus: (state, action) => {
      if (state.vendorUser) {
        state.vendorUser.kycStatus = action.payload;
        localStorage.setItem('em_vendor_user', JSON.stringify(state.vendorUser));
      }
    }
  }
});

export const {
  vendorAuthStart,
  vendorSendOtpSuccess,
  vendorVerifyOtpSuccess,
  vendorLoginSuccess,
  vendorAuthFailure,
  vendorLogout,
  vendorUpdateKycStatus
} = vendorAuthSlice.actions;

export default vendorAuthSlice.reducer;
