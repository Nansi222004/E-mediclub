const express = require('express');
const router = express.Router();
const { getDoctors, getAvailableSlots } = require('../controllers/doctorsController');

router.get('/', getDoctors);
router.get('/:id/available-slots', getAvailableSlots);

module.exports = router;
