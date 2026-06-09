const express = require('express');
const router = express.Router();
const { getDoctors } = require('../controllers/doctorsController');

router.get('/', getDoctors);

module.exports = router;
