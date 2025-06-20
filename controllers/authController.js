const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const JWT_SECRET = 'your_secret_key';

exports.signup = async (req, res) => {
  const { email, password, role } = req.body;
  if (!['admin', 'recruiter', 'jobseeker'].includes(role)) {
    return res.status(400).json({ message: 'Invalid role' });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  db.query(
    'INSERT INTO users (email, password, role) VALUES (?, ?, ?)',
    [email, hashedPassword, role],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(200).json({ message: 'User registered successfully!' });
    }
  );
};

exports.login = (req, res) => {
  const { email, password } = req.body;
  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.length === 0) return res.status(400).json({ message: 'User not found!' });
    const validPassword = await bcrypt.compare(password, result[0].password);
    if (!validPassword) return res.status(400).json({ message: 'Invalid password!' });
    const token = jwt.sign({ id: result[0].id, role: result[0].role }, JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ token, role: result[0].role, id: result[0].id });
  });
};