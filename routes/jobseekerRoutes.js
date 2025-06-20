const express = require('express');
const { applyJob, getApplications, getStats } = require('../controllers/jobseekerController');
const { authenticate, authorize } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/apply', authenticate, authorize(['jobseeker']), applyJob);
router.get('/applications', authenticate, authorize(['jobseeker']), getApplications);
router.get('/stats', authenticate, authorize(['jobseeker']), getStats);

module.exports = router;