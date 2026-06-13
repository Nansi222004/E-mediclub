const express = require('express');
const router = express.Router();
const { uploadPrescription } = require('../controllers/prescriptionController');
const { protect } = require('../middleware/authMiddleware');
const { uploadPrescription: uploadMiddleware } = require('../middleware/upload');

// POST /api/prescriptions/upload
router.post('/upload', protect, uploadMiddleware.single('file'), uploadPrescription);

module.exports = router;
