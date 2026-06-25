const express = require('express');
const router = express.Router();
const { getDoctors, cancelAppointment } = require('../controllers/doctorsController');
const { protect } = require('../middleware/authMiddleware');
const validate = require('../middleware/validate');
const { cancelAppointmentSchema } = require('../validations/doctor.validation');

router.get('/', getDoctors);
router.post('/appointments/:id/cancel', protect, validate(cancelAppointmentSchema), cancelAppointment);

module.exports = router;
