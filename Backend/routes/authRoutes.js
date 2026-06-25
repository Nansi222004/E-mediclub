const express = require('express');
const router = express.Router();
const { 
  register, 
  login, 
  logout, 
  refresh, 
  forgotPassword, 
  resetPassword, 
  changePassword, 
  getMe, 
  updateProfile, 
  sendOTP, 
  verifyOTP,
  registerPharmacy
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { createUploadMiddleware } = require('../middleware/upload');
const validate = require('../middleware/validate');
const { 
  registerSchema, 
  loginSchema, 
  sendOtpSchema, 
  verifyOtpSchema, 
  updateProfileSchema 
} = require('../validations/auth.validation');

const uploadPharmacyDocs = createUploadMiddleware("emediclub/pharmacy-docs").fields([
  { name: 'drugLicense', maxCount: 1 },
  { name: 'gstCertificate', maxCount: 1 },
  { name: 'pharmacistCertificate', maxCount: 1 },
  { name: 'panCard', maxCount: 1 },
  { name: 'logo', maxCount: 1 },
  { name: 'storeFrontImage', maxCount: 1 },
  { name: 'governmentId', maxCount: 1 },
  { name: 'pharmacyPhoto', maxCount: 1 }
]);

// Route configurations purely mapping to controllers
router.post('/register', validate(registerSchema), register);
router.post('/register-pharmacy', uploadPharmacyDocs, registerPharmacy);
router.post('/login', validate(loginSchema), login);
router.post('/logout', protect, logout);
router.post('/refresh', refresh);

// Enhanced Auth routes
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/change-password', protect, changePassword);
router.get('/me', protect, getMe);
router.put('/update-profile', protect, validate(updateProfileSchema), updateProfile);
router.post('/send-otp', validate(sendOtpSchema), sendOTP);
router.post('/verify-otp', validate(verifyOtpSchema), verifyOTP);

module.exports = router;
