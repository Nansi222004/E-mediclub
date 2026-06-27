const express = require('express');
const router = express.Router();
const { cancelAppointment, rescheduleAppointment } = require('../controllers/appointmentController');
const { protect } = require('../middleware/authMiddleware');

router.post('/:id/cancel', protect, cancelAppointment);
router.post('/:id/reschedule', protect, rescheduleAppointment);

module.exports = router;
