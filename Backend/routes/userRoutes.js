const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress
} = require('../controllers/userController');

// All address routes are protected
router.route('/addresses')
  .get(protect, getAddresses)
  .post(protect, addAddress);

router.route('/addresses/:id')
  .put(protect, updateAddress)
  .delete(protect, deleteAddress);

module.exports = router;
