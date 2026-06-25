const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress
} = require('../controllers/userController');
const validate = require('../middleware/validate');
const { addressSchema } = require('../validations/user.validation');

// All address routes are protected
router.route('/addresses')
  .get(protect, getAddresses)
  .post(protect, validate(addressSchema), addAddress);

router.route('/addresses/:id')
  .put(protect, validate(addressSchema), updateAddress)
  .delete(protect, deleteAddress);

module.exports = router;
