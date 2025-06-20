const express = require('express');
const { getAllUsers, getAllJobs, getAllApplications } = require('../controllers/adminController');
const { authenticate, authorize } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/users', authenticate, authorize(['admin']), getAllUsers);
router.get('/jobs', authenticate, authorize(['admin']), getAllJobs);
router.get('/applications', authenticate, authorize(['admin']), getAllApplications);

module.exports = router;