const db = require('../config/db');

// Apply to a job
exports.applyJob = (req, res) => {
  const jobId = req.body.jobId;
  const userId = req.user.id;
  db.query(
    'INSERT INTO applications (jobId, userId) VALUES (?, ?)',
    [jobId, userId],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(200).json({ message: 'Applied successfully!' });
    }
  );
};

// Get all applications for this jobseeker
exports.getApplications = (req, res) => {
  const userId = req.user.id;
  db.query(
    `SELECT a.*, j.title, j.status 
     FROM applications a 
     JOIN jobs j ON a.jobId = j.id 
     WHERE a.userId = ?`,
    [userId],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(200).json(results);
    }
  );
};

// Get stats for this jobseeker
exports.getStats = (req, res) => {
  const userId = req.user.id;
  db.query(
    `SELECT status, COUNT(*) as count FROM applications WHERE userId = ? GROUP BY status`,
    [userId],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(200).json(results);
    }
  );
};