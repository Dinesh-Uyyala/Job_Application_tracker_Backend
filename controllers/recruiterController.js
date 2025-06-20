const db = require('../config/db');

// Get stats for this recruiter
exports.getStats = (req, res) => {
  const recruiter_id = req.user.id;
  db.query(
    `SELECT j.status, COUNT(a.id) as applications
     FROM jobs j
     LEFT JOIN applications a ON j.id = a.jobId
     WHERE j.createdBy = ?
     GROUP BY j.status`,
    [recruiter_id],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(200).json(results);
    }
  );
};