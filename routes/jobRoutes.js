const express = require('express');
const { getJobs, createJob, editJob, deleteJob, getRecruiterJobs } = require('../controllers/jobController');
const { authenticate, authorize } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/', getJobs);
router.get('/recruiter/:recruiterId', authenticate, authorize(['recruiter']), getRecruiterJobs);
router.post('/create', authenticate, authorize(['recruiter']), createJob);
router.put('/edit/:jobId', authenticate, authorize(['recruiter']), editJob);
router.delete('/delete/:jobId', authenticate, authorize(['recruiter']), deleteJob);

module.exports = router;