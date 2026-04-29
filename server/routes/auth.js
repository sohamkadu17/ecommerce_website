const express  = require('express');
const bcrypt   = require('bcryptjs');
const jwt      = require('jsonwebtoken');
const db       = require('../db');
const verifyToken = require('../middleware/auth');
const router   = express.Router();

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@shopeasy.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
const ADMIN_ID = Number(process.env.ADMIN_ID || 9001);

router.post('/register', (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password)
    return res.status(400).json({ error: 'All fields are required' });
  db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length > 0)
      return res.status(409).json({ error: 'Email already registered' });
    const hashedPassword = bcrypt.hashSync(password, 10);
    db.query(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      [username, email, hashedPassword],
      (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: 'User registered successfully!', userId: result.insertId });
      }
    );
  });
});

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: 'Email and password are required' });
  db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0)
      return res.status(401).json({ error: 'Invalid email or password' });
    const user = results[0];
    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch)
      return res.status(401).json({ error: 'Invalid email or password' });
    const token = jwt.sign(
      { userId: user.user_id, username: user.username, role: 'user' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.json({
      message: 'Login successful!',
      token,
      user: { id: user.user_id, username: user.username, email: user.email, role: 'user' }
    });
  });
});

router.post('/admin/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: 'Email and password are required' });
  // Check for a DB-backed admin user first
  db.query('SELECT * FROM users WHERE email = ? AND role = ?', [email, 'admin'], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    if (results.length > 0) {
      const admin = results[0];
      const isMatch = bcrypt.compareSync(password, admin.password);
      if (!isMatch) return res.status(401).json({ error: 'Invalid admin credentials' });

      const token = jwt.sign(
        { userId: admin.user_id, username: admin.username, email: admin.email, role: 'admin' },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      return res.json({
        message: 'Admin login successful!',
        token,
        user: { id: admin.user_id, username: admin.username, email: admin.email, role: 'admin' }
      });
    }

    // Fallback to env-configured admin (legacy)
    if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
      return res.status(401).json({ error: 'Invalid admin credentials' });
    }

    const token = jwt.sign(
      { userId: ADMIN_ID, username: 'Admin', email: ADMIN_EMAIL, role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Admin login successful!',
      token,
      user: { id: ADMIN_ID, username: 'Admin', email: ADMIN_EMAIL, role: 'admin' }
    });
  });
});

router.post('/forgot-password', (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required' });

  db.query('SELECT user_id, email FROM users WHERE email = ?', [email], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    if (results.length > 0) {
      const otp = String(Math.floor(100000 + Math.random() * 900000));
      console.log(`🔐 OTP for ${results[0].email}: ${otp}`);
    }

    return res.json({ message: 'If an account exists, an OTP has been sent.' });
  });
});

router.get('/me', verifyToken, (req, res) => {
  if (req.user.role === 'admin') {
    return res.json({ id: ADMIN_ID, username: 'Admin', email: ADMIN_EMAIL, role: 'admin' });
  }

  db.query(
    'SELECT user_id, username, email, created_at FROM users WHERE user_id = ?',
    [req.user.userId],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      if (results.length === 0) return res.status(404).json({ error: 'User not found' });

      const u = results[0];
      res.json({ id: u.user_id, username: u.username, email: u.email, created_at: u.created_at, role: 'user' });
    }
  );
});

router.patch('/me', verifyToken, (req, res) => {
  if (req.user.role === 'admin') {
    return res.status(400).json({ error: 'Admin profile cannot be updated here.' });
  }

  const { username, email } = req.body;
  if (!username || !email)
    return res.status(400).json({ error: 'username and email are required' });

  db.query(
    'SELECT user_id FROM users WHERE (email = ? OR username = ?) AND user_id <> ?',
    [email, username, req.user.userId],
    (err, existing) => {
      if (err) return res.status(500).json({ error: err.message });
      if (existing.length > 0) return res.status(409).json({ error: 'Email or username already in use' });

      db.query(
        'UPDATE users SET username = ?, email = ? WHERE user_id = ?',
        [username, email, req.user.userId],
        (updateErr) => {
          if (updateErr) return res.status(500).json({ error: updateErr.message });
          res.json({ message: 'Profile updated successfully', user: { id: req.user.userId, username, email, role: 'user' } });
        }
      );
    }
  );
});

router.patch('/change-password', verifyToken, (req, res) => {
  if (req.user.role === 'admin') {
    return res.status(400).json({ error: 'Admin password is fixed by server configuration.' });
  }

  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword)
    return res.status(400).json({ error: 'currentPassword and newPassword are required' });
  if (newPassword.length < 6)
    return res.status(400).json({ error: 'New password must be at least 6 characters long' });

  db.query('SELECT password FROM users WHERE user_id = ?', [req.user.userId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ error: 'User not found' });

    const isMatch = bcrypt.compareSync(currentPassword, results[0].password);
    if (!isMatch) return res.status(401).json({ error: 'Current password is incorrect' });

    const hashedPassword = bcrypt.hashSync(newPassword, 10);
    db.query('UPDATE users SET password = ? WHERE user_id = ?', [hashedPassword, req.user.userId], (updateErr) => {
      if (updateErr) return res.status(500).json({ error: updateErr.message });
      res.json({ message: 'Password changed successfully' });
    });
  });
});

module.exports = router;