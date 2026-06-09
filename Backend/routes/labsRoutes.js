const express = require('express');
const router = express.Router();
const { getLabs } = require('../controllers/labsController');

router.get('/', getLabs);

module.exports = router;
