const express = require('express');
const router = express.Router();
const { 
  getLabs, 
  bookLab,
  getMyLabBookings,
  getVendorBookings,
  updateBookingStatus,
  uploadBookingReport,
  getVendorProfile,
  updateVendorProfile,
  getVendorTests,
  addVendorTest,
  updateVendorTest,
  deleteVendorTest,
  getVendorPackages,
  addVendorPackage,
  updateVendorPackage,
  deleteVendorPackage,
  replyToReview
} = require('../controllers/labsController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const { uploadLabReport } = require('../middleware/upload');

// Public routes
router.get('/', getLabs);

// Booking routes for users
router.post('/book', protect, uploadLabReport.single('file'), bookLab);
router.get('/my-bookings', protect, getMyLabBookings);

// Vendor specific routes
router.get('/vendor/bookings', protect, authorize('lab_vendor'), getVendorBookings);
router.put('/vendor/bookings/:id/status', protect, authorize('lab_vendor'), updateBookingStatus);
router.put('/vendor/bookings/:id/report', protect, authorize('lab_vendor'), uploadLabReport.single('file'), uploadBookingReport);
router.get('/vendor/profile', protect, authorize('lab_vendor'), getVendorProfile);
router.put('/vendor/profile', protect, authorize('lab_vendor'), updateVendorProfile);
router.get('/vendor/tests', protect, authorize('lab_vendor'), getVendorTests);
router.post('/vendor/tests', protect, authorize('lab_vendor'), addVendorTest);
router.put('/vendor/tests/:id', protect, authorize('lab_vendor'), updateVendorTest);
router.delete('/vendor/tests/:id', protect, authorize('lab_vendor'), deleteVendorTest);
router.get('/vendor/packages', protect, authorize('lab_vendor'), getVendorPackages);
router.post('/vendor/packages', protect, authorize('lab_vendor'), addVendorPackage);
router.put('/vendor/packages/:id', protect, authorize('lab_vendor'), updateVendorPackage);
router.delete('/vendor/packages/:id', protect, authorize('lab_vendor'), deleteVendorPackage);
router.post('/vendor/reviews/:id/reply', protect, authorize('lab_vendor'), replyToReview);

module.exports = router;
