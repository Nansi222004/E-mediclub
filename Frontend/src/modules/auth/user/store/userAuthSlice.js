// Conform cleanly to user panel folder architectures
import userAuthReducer, {
  sendOtpStart,
  sendOtpSuccess,
  verifyOtpSuccess,
  authFailure,
  logout,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress
} from '../../store/authSlice';

export {
  sendOtpStart,
  sendOtpSuccess,
  verifyOtpSuccess,
  authFailure,
  logout,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress
};

export default userAuthReducer;
