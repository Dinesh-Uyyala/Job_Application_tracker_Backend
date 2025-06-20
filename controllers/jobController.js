const db = require('../config/db');

// Get all jobs (public)
exports.getJobs = (req, res) => {
  db.query('SELECT * FROM jobs', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json(results);
  });
};

// Get jobs posted by a recruiter (recruiter only)
exports.getRecruiterJobs = (req, res) => {
  const recruiterId = req.params.recruiterId;
  db.query('SELECT * FROM jobs WHERE recruiter_id = ?', [recruiterId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json(results);
  });
};

// Create new job (recruiter only)
exports.createJob = (req, res) => {
  const recruiterId = req.user.id;
  const {
    title,
    description,
    companyName,
    location,
    vacancies,
    logo,
    package: pkg,
    experience,
    workMode,
    status
  } = req.body;

  db.query(
    `INSERT INTO jobs
      (title, description, companyName, location, vacancies, logo, package, experience, workMode, status, createdBy, updatedBy)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      title,
      description,
      companyName,
      location,
      vacancies,
      logo,
      pkg,
      experience,
      workMode,
      status,
      recruiterId,
      recruiterId
    ],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ message: 'Job created', jobId: result.insertId });
    }
  );
};

// Edit a job (recruiter only)
exports.editJob = (req, res) => {
  const { title, status } = req.body;
  const jobId = req.params.jobId;
  const recruiter_id = req.user.id;
  db.query(
    'UPDATE jobs SET title = ?, status = ? WHERE id = ? AND recruiter_id = ?',
    [title, status, jobId, recruiter_id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      if (result.affectedRows === 0) return res.status(403).json({ message: 'Not allowed' });
      res.status(200).json({ message: 'Job updated successfully!' });
    }
  );
};

// Delete a job (recruiter only)
exports.deleteJob = (req, res) => {
  const jobId = req.params.jobId;
  const recruiter_id = req.user.id;
  db.query(
    'DELETE FROM jobs WHERE id = ? AND recruiter_id = ?',
    [jobId, recruiter_id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      if (result.affectedRows === 0) return res.status(403).json({ message: 'Not allowed' });
      res.status(200).json({ message: 'Job deleted successfully!' });
    }
  );
};