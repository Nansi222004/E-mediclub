import { createSlice } from '@reduxjs/toolkit';

// Retrieve values from localStorage to support persistency
const storedUser = localStorage.getItem('em_user') ? JSON.parse(localStorage.getItem('em_user')) : null;
const storedToken = localStorage.getItem('em_token') || null;
const storedAddresses = localStorage.getItem('em_addresses') 
  ? JSON.parse(localStorage.getItem('em_addresses')) 
  : [
      { id: 1, name: 'Home', phone: '9876543210', pincode: '400001', addressLine: '12, Garden View, Link Road', city: 'Mumbai', state: 'Maharashtra', isDefault: true },
      { id: 2, name: 'Office', phone: '9876543211', pincode: '110001', addressLine: 'Plot 45, Tech Park, Sector V', city: 'New Delhi', state: 'Delhi', isDefault: false }
    ];

const storedCards = localStorage.getItem('em_saved_cards')
  ? JSON.parse(localStorage.getItem('em_saved_cards'))
  : [
      { id: 'c-1', bank: 'HDFC Bank Credit Card', last4: '9874', expiry: '12/28', city: 'Mumbai', pincode: '400001' },
      { id: 'c-2', bank: 'ICICI Bank Debit Card', last4: '3412', expiry: '05/29', city: 'New Delhi', pincode: '110001' }
    ];

const initialState = {
  user: storedUser,
  token: storedToken,
  isAuthenticated: !!storedToken,
  loading: false,
  error: null,
  addresses: storedAddresses,
  savedCards: storedCards,
  otpSent: false,
  otpVerificationPending: false,
  tempPhone: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    sendOtpStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    sendOtpSuccess: (state, action) => {
      state.loading = false;
      state.otpSent = true;
      state.otpVerificationPending = true;
      state.tempPhone = action.payload;
    },
    verifyOtpSuccess: (state, action) => {
      state.loading = false;
      state.otpSent = false;
      state.otpVerificationPending = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.tempPhone = null;
      localStorage.setItem('em_user', JSON.stringify(state.user));
      localStorage.setItem('em_token', state.token);
    },
    refreshTokenSuccess: (state, action) => {
      state.token = action.payload;
      localStorage.setItem('em_token', action.payload);
    },
    authFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.otpSent = false;
      state.otpVerificationPending = false;
      localStorage.removeItem('em_user');
      localStorage.removeItem('em_token');
    },
    updateUserProfile: (state, action) => {
      state.user = { ...(state.user || {}), ...action.payload };
      localStorage.setItem('em_user', JSON.stringify(state.user));
    },
    addAddress: (state, action) => {
      const newAddress = { ...action.payload, id: Date.now() };
      if (newAddress.isDefault) {
        state.addresses = state.addresses.map(addr => ({ ...addr, isDefault: false }));
      }
      state.addresses.push(newAddress);
      localStorage.setItem('em_addresses', JSON.stringify(state.addresses));
    },
    updateAddress: (state, action) => {
      const updated = action.payload;
      if (updated.isDefault) {
        state.addresses = state.addresses.map(addr => ({ ...addr, isDefault: false }));
      }
      state.addresses = state.addresses.map(addr => addr.id === updated.id ? updated : addr);
      localStorage.setItem('em_addresses', JSON.stringify(state.addresses));
    },
    deleteAddress: (state, action) => {
      state.addresses = state.addresses.filter(addr => addr.id !== action.payload);
      // Ensure there is at least one default if list is not empty
      if (state.addresses.length > 0 && !state.addresses.some(addr => addr.isDefault)) {
        state.addresses[0].isDefault = true;
      }
      localStorage.setItem('em_addresses', JSON.stringify(state.addresses));
    },
    setDefaultAddress: (state, action) => {
      state.addresses = state.addresses.map(addr => ({
        ...addr,
        isDefault: addr.id === action.payload
      }));
      localStorage.setItem('em_addresses', JSON.stringify(state.addresses));
    },
    addSavedCard: (state, action) => {
      state.savedCards.push(action.payload);
      localStorage.setItem('em_saved_cards', JSON.stringify(state.savedCards));
    },
    deleteSavedCard: (state, action) => {
      state.savedCards = state.savedCards.filter(card => card.id !== action.payload);
      localStorage.setItem('em_saved_cards', JSON.stringify(state.savedCards));
    }
  }
});

export const {
  sendOtpStart,
  sendOtpSuccess,
  verifyOtpSuccess,
  refreshTokenSuccess,
  authFailure,
  logout,
  updateUserProfile,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
  addSavedCard,
  deleteSavedCard
} = authSlice.actions;

export default authSlice.reducer;
