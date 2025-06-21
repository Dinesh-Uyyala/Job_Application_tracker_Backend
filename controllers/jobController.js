const db = require('../config/db');

// Get all jobs (public)
exports.getJobs = (req, res) => {
  db.query('SELECT * FROM jobs', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json(results);
  });
};

// get specific job by ID (public)
exports.getJobById = (req, res) => {
  const jobId = req.params.jobId;
  db.query('SELECT * FROM jobs WHERE id = ?', [jobId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ message: 'Job not found' });
    res.status(200).json(results[0]);
  });
};

// Get jobs posted by a recruiter (recruiter only)
exports.getRecruiterJobs = (req, res) => {
  const recruiterId = req.params.recruiterId;
  db.query('SELECT * FROM jobs WHERE createdBy = ?', [recruiterId], (err, results) => {
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
    'UPDATE jobs SET title = ?, status = ? WHERE id = ? AND updatedBy = ?',
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

// Check if a job is applied for (recruiter only)
exports.appliedForJob = (req, res) => {
  const jobId = req.params.jobId;
  const recruiterId = req.user.id;

  db.query(
    'SELECT * FROM applications WHERE jobId = ? AND createdBy = ?',
    [jobId, recruiterId],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      if (results.length === 0) return res.status(404).json({ message: 'No applications found for this job' });
      res.status(200).json(results);
    }
  );
};

// Check application status for a job (jobseeker only)
exports.appliedStatus = (req, res) => {
  const jobId = req.params.jobId;
  const jobseekerId = req.params.id;

  db.query(
    'SELECT status FROM applications WHERE jobId = ? AND userId = ?',
    [jobId, jobseekerId],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      if (results.length === 0) {
        return res.status(200).json({ status: 'Not Applied' });
      }

      res.status(200).json({ status: results[0].status });
    }
  );
};


// Submit a job application (jobseeker)
exports.applyForJob = (req, res) => {
  const { jobId, userId, name, email, mobile, resumeLink } = req.body;

  const query = `
    INSERT INTO applications (jobId, userId, name, email, mobile, resumeLink, status)
    VALUES (?, ?, ?, ?, ?, ?, 'Applied')
  `;

  db.query(query, [jobId, userId, name, email, mobile, resumeLink], (err, result) => {
    if (err) {
      console.error('Error inserting application:', err);
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json({ message: 'Application submitted successfully' });
  });
};

