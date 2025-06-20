const db = require('../config/db');

exports.getAllUsers = (req, res) => {
  db.query('SELECT id, email, role, CreatedAt FROM users', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json(results);
  });
};

exports.getAllJobs = (req, res) => {
  db.query('SELECT * FROM jobs', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json(results);
  });
};

exports.getAllApplications = (req, res) => {
  db.query('SELECT * FROM applications', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json(results);
  });
};