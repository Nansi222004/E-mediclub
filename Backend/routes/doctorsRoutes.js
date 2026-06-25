const express = require('express');
const router = express.Router();
const { getDoctors, cancelAppointment } = require('../controllers/doctorsController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', getDoctors);
router.post('/appointments/:id/cancel', protect, cancelAppointment);

module.exports = router;
