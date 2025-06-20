const express = require('express');
const { getStats } = require('../controllers/recruiterController');
const { authenticate, authorize } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/stats', authenticate, authorize(['recruiter']), getStats);

module.exports = router;