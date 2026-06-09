const express = require('express');
const router = express.Router();
const {
  validatePincode,
  checkServiceability,
  getNearbyLocations,
  verifyPincode
} = require('../controllers/locationController');

// Pincode validation & serviceability check routes
router.get('/verify', verifyPincode);
router.get('/validate/:pincode', validatePincode);
router.post('/check-serviceability', checkServiceability);
router.get('/nearby', getNearbyLocations);

module.exports = router;
