const express = require('express');
const router = express.Router();
const { 
  getDashboardStats,
  getDashboardVendorsPharmacy,
  getDashboardVendorsLabs,
  getDashboardVendorsDoctors,
  getDashboardChartsOrders,
  getDashboardChartsRevenue,
  getDashboardChartsUsers,
  getDashboardRecentOrders,
  getDashboardRecentVendors,
  getDashboardActivityFeed,
  getDashboardTopVendors,
  getDashboardFinancial,
  getLocationsStates,
  getLocationsCities,
  getLocationsPincodes,
  getOrdersMedicines,
  getOrdersLabBookings,
  getOrdersAppointments,
  getMedicines,
  getLabTests,
  getDoctors,
  getVendors,
  getPatients,
  getVendorsDebug,
  getPatientsDebug,
  getPayments,
  getComplaints,
  getHomeCollections,
  getPrescriptions,
  approveVendor,
  rejectVendor
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/roleMiddleware');

// Dashboard routes
router.get('/dashboard/stats', protect, adminOnly, getDashboardStats);
router.get('/dashboard/vendors/pharmacy', protect, adminOnly, getDashboardVendorsPharmacy);
router.get('/dashboard/vendors/labs', protect, adminOnly, getDashboardVendorsLabs);
router.get('/dashboard/vendors/doctors', protect, adminOnly, getDashboardVendorsDoctors);
router.get('/dashboard/charts/orders', protect, adminOnly, getDashboardChartsOrders);
router.get('/dashboard/charts/revenue', protect, adminOnly, getDashboardChartsRevenue);
router.get('/dashboard/charts/users', protect, adminOnly, getDashboardChartsUsers);
router.get('/dashboard/recent-orders', protect, adminOnly, getDashboardRecentOrders);
router.get('/dashboard/recent-vendors', protect, adminOnly, getDashboardRecentVendors);
router.get('/dashboard/activity-feed', protect, adminOnly, getDashboardActivityFeed);
router.get('/dashboard/top-vendors', protect, adminOnly, getDashboardTopVendors);
router.get('/dashboard/financial', protect, adminOnly, getDashboardFinancial);

// Locations dynamic dropdowns
router.get('/locations/states', protect, adminOnly, getLocationsStates);
router.get('/locations/cities', protect, adminOnly, getLocationsCities);
router.get('/locations/pincodes', protect, adminOnly, getLocationsPincodes);

// Admin registries
router.get('/orders/medicines', protect, adminOnly, getOrdersMedicines);
router.get('/orders/lab-bookings', protect, adminOnly, getOrdersLabBookings);
router.get('/orders/appointments', protect, adminOnly, getOrdersAppointments);
router.get('/medicines', protect, adminOnly, getMedicines);
router.get('/lab-tests', protect, adminOnly, getLabTests);
router.get('/doctors', protect, adminOnly, getDoctors);
router.get('/vendors', protect, adminOnly, getVendors);
router.get('/patients', protect, adminOnly, getPatients);
router.get('/vendors/debug', getVendorsDebug);
router.get('/patients/debug', getPatientsDebug);
router.get('/payments', protect, adminOnly, getPayments);
router.get('/complaints', protect, adminOnly, getComplaints);
router.get('/home-collections', protect, adminOnly, getHomeCollections);
router.get('/prescriptions', protect, adminOnly, getPrescriptions);

// Vendor Approval actions
router.put('/vendors/:id/approve', protect, adminOnly, approveVendor);
router.put('/vendors/:id/reject', protect, adminOnly, rejectVendor);

module.exports = router;
