import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../../modules/auth/store/authSlice';
import cartReducer from '../../modules/user/store/cartSlice';
import productReducer from '../../modules/user/store/productSlice';
import adminReducer from '../../modules/admin/store/adminSlice';
import vendorReducer from '../../modules/vendor/store/vendorSlice';
import adminAuthReducer from '../../modules/auth/admin/store/adminAuthSlice';
import vendorAuthReducer from '../../modules/auth/vendor/store/vendorAuthSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    products: productReducer,
    admin: adminReducer,
    vendor: vendorReducer,
    adminAuth: adminAuthReducer,
    vendorAuth: vendorAuthReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
