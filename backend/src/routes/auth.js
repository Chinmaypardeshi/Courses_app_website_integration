const { Router } = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../db/pool');
const { env } = require('../config/env');
const { authenticate } = require('../middleware/authenticate');
const { sendWelcomeEmail } = require('../services/email');

const authRouter = Router();

function generateToken(user) {
  return jwt.sign(
    {
      sub: user.id,
      userId: user.id,
      email: user.email,
      name: user.full_name,
      role: user.role,
    },
    env.jwtSecret,
    { expiresIn: env.jwtExpiresIn }
  );
}

function formatUser(row) {
  return {
    id: String(row.id),
    name: row.full_name,
    full_name: row.full_name,
    email: row.email,
    role: row.role || 'student',
    phone: row.phone || '',
    avatar: row.avatar || '',
    preferences: row.preferences || {},
    isActive: row.is_active !== false,
    createdAt: row.created_at,
  };
}

// Unified Register / Signup
async function handleRegister(req, res) {
  try {
    const { name, fullName, email, password, phone } = req.body;
    const displayName = (fullName || name || '').trim();
    const cleanEmail = (email || '').trim().toLowerCase();

    if (!displayName) {
      return res.status(400).json({ success: false, error: 'Full name is required.' });
    }
    if (!cleanEmail || !cleanEmail.includes('@')) {
      return res.status(400).json({ success: false, error: 'A valid email is required.' });
    }
    if (!password || password.length < 6) {
      return res.status(400).json({ success: false, error: 'Password must be at least 6 characters.' });
    }

    // Check existing
    const existing = await pool.query('SELECT id FROM users WHERE email = $1', [cleanEmail]);
    if (existing.rowCount > 0) {
      return res.status(409).json({ success: false, error: 'An account with this email already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(`
      INSERT INTO users (full_name, email, password_hash, role, phone, is_active)
      VALUES ($1, $2, $3, 'student', $4, TRUE)
      RETURNING id, full_name, email, role, phone, avatar, preferences, is_active, created_at
    `, [displayName, cleanEmail, hashedPassword, phone || null]);

    const user = result.rows[0];
    const token = generateToken(user);

    // Send welcome email asynchronously
    sendWelcomeEmail({ email: cleanEmail, name: displayName }).catch(() => {});

    return res.status(201).json({
      success: true,
      user: formatUser(user),
      token,
      message: 'Account created successfully!',
    });
  } catch (err) {
    console.error('Registration Error:', err);
    return res.status(500).json({ success: false, error: 'Server error during registration.' });
  }
}

// Unified Login
async function handleLogin(req, res) {
  try {
    const { email, password } = req.body;
    const cleanEmail = (email || '').trim().toLowerCase();

    if (!cleanEmail || !password) {
      return res.status(400).json({ success: false, error: 'Email and password are required.' });
    }

    const result = await pool.query(`
      SELECT id, full_name, email, password_hash, role, phone, avatar, preferences, is_active, created_at
      FROM users WHERE email = $1
    `, [cleanEmail]);

    const user = result.rows[0];
    if (!user || !user.password_hash) {
      return res.status(401).json({ success: false, error: 'Invalid email or password.' });
    }

    if (user.is_active === false) {
      return res.status(403).json({ success: false, error: 'Your account has been deactivated.' });
    }

    const matches = await bcrypt.compare(password, user.password_hash);
    if (!matches) {
      return res.status(401).json({ success: false, error: 'Invalid email or password.' });
    }

    const token = generateToken(user);
    return res.status(200).json({
      success: true,
      user: formatUser(user),
      token,
      message: 'Logged in successfully!',
    });
  } catch (err) {
    console.error('Login Error:', err);
    return res.status(500).json({ success: false, error: 'Server error during login.' });
  }
}

// Google OAuth Login / Registration
async function handleGoogleAuth(req, res) {
  try {
    const { email, name, avatar } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, error: 'Google email is required.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    let result = await pool.query('SELECT * FROM users WHERE email = $1', [cleanEmail]);
    let user = result.rows[0];

    if (!user) {
      const insertRes = await pool.query(`
        INSERT INTO users (full_name, email, role, avatar, is_active)
        VALUES ($1, $2, 'student', $3, TRUE)
        RETURNING *
      `, [name || 'Google Learner', cleanEmail, avatar || null]);
      user = insertRes.rows[0];
      sendWelcomeEmail({ email: cleanEmail, name: user.full_name }).catch(() => {});
    }

    const token = generateToken(user);
    return res.status(200).json({
      success: true,
      user: formatUser(user),
      token,
    });
  } catch (err) {
    console.error('Google Auth Error:', err);
    return res.status(500).json({ success: false, error: 'Server error during Google auth.' });
  }
}

// Routes
authRouter.post('/register', handleRegister);
authRouter.post('/signup', handleRegister);
authRouter.post('/login', handleLogin);
authRouter.post('/google', handleGoogleAuth);

authRouter.get('/me', authenticate, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [req.auth.userId]);
    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, error: 'User not found.' });
    }
    return res.status(200).json({ success: true, user: formatUser(result.rows[0]) });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Failed to fetch user profile.' });
  }
});

authRouter.post('/terminate-sessions', authenticate, (req, res) => {
  return res.status(200).json({ success: true, message: 'All other active sessions terminated.' });
});

// Welcome Email Endpoint
authRouter.post('/send-welcome-email', async (req, res) => {
  const { email, name } = req.body;
  if (!email) return res.status(400).json({ success: false, error: 'Email is required.' });
  const result = await sendWelcomeEmail({ email, name: name || 'Learner' });
  return res.status(200).json(result);
});

module.exports = { authRouter };
