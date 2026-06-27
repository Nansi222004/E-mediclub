const express = require('express');
const router = express.Router();
const { cancelOrder, returnOrder } = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

router.post('/:id/cancel', protect, cancelOrder);
router.post('/:id/return', protect, returnOrder);

module.exports = router;
