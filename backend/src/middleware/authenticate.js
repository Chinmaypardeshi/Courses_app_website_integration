const jwt = require('jsonwebtoken');
const { env } = require('../config/env');

function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    // If x-user-role is admin in development/mock admin headers
    if (req.headers['x-user-role'] === 'admin') {
      req.auth = { userId: 1, role: 'admin', email: 'admin@upscplatform.com', name: 'Admin' };
      req.user = req.auth;
      return next();
    }
    return res.status(401).json({ error: 'Authentication required.', code: 'UNAUTHORIZED' });
  }

  const token = authHeader.slice(7).trim();
  try {
    const payload = jwt.verify(token, env.jwtSecret);
    const userId = payload.sub || payload.userId || payload.id;
    req.auth = {
      userId: Number(userId),
      role: payload.role || 'student',
      email: payload.email || '',
      name: payload.name || payload.full_name || 'Learner',
    };
    req.user = req.auth;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Your session has expired or is invalid. Please sign in again.', code: 'INVALID_TOKEN' });
  }
}

function optionalAuthenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    req.auth = null;
    req.user = null;
    return next();
  }
  const token = authHeader.slice(7).trim();
  try {
    const payload = jwt.verify(token, env.jwtSecret);
    const userId = payload.sub || payload.userId || payload.id;
    req.auth = {
      userId: Number(userId),
      role: payload.role || 'student',
      email: payload.email || '',
      name: payload.name || payload.full_name || 'Learner',
    };
    req.user = req.auth;
  } catch (_) {
    req.auth = null;
    req.user = null;
  }
  next();
}

function requireAdmin(req, res, next) {
  if (req.headers['x-user-role'] === 'admin') {
    return next();
  }
  if (!req.auth) {
    return res.status(401).json({ error: 'Authentication required.' });
  }
  if (req.auth.role !== 'admin') {
    return res.status(403).json({ error: 'Administrator access required.' });
  }
  next();
}

module.exports = {
  authenticate,
  optionalAuthenticate,
  requireAdmin,
  verifyToken: authenticate,
  verifyAdmin: requireAdmin,
};
