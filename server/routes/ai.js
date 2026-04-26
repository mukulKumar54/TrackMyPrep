const express = require('express');
const router = express.Router();
const { getSuggestions } = require('../controllers/aiController');
const { protect } = require('../middleware/auth');

router.post('/suggestions', protect, getSuggestions);

module.exports = router;
