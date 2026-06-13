const express = require('express');
const router = express.Router();
const { getLabs, bookLab } = require('../controllers/labsController');
const { protect } = require('../middleware/authMiddleware');
const { uploadLabReport } = require('../middleware/upload');

router.get('/', getLabs);
router.post('/book', protect, uploadLabReport.single('file'), bookLab);

module.exports = router;
