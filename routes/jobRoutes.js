const express = require('express');
const { getJobs,getJobById, createJob, editJob, deleteJob, getRecruiterJobs,appliedForJob,appliedStatus,submitApplication } = require('../controllers/jobController');
const { authenticate, authorize } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/', getJobs);
router.get('/:jobId', getJobById); // Assuming getJobById is imported from jobController
router.get('/recruiter/:recruiterId', authenticate, authorize(['recruiter']), getRecruiterJobs);
router.post('/create', authenticate, authorize(['recruiter']), createJob);
router.put('/edit/:jobId', authenticate, authorize(['recruiter']), editJob);
router.delete('/delete/:jobId', authenticate, authorize(['recruiter']), deleteJob);
router.get('/applied/:jobId', authenticate, authorize(['recruiter']),appliedForJob);
router.get('/:jobId/status/:userId', authenticate, authorize(['jobseeker']), appliedStatus);
router.post('/api/applications', authenticate, authorize(['jobseeker']), submitApplication);
module.exports = router;