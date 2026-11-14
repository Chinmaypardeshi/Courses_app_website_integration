const express = require('express');
const cors = require('cors');
const { env } = require('./config/env');
const { errorHandler, notFoundHandler } = require('./middleware/error-handler');

// Import Routers
const { healthRouter } = require('./routes/health');
const { authRouter } = require('./routes/auth');
const { coursesRouter } = require('./routes/courses');
const { currentAffairsRouter } = require('./routes/current-affairs');
const { testsRouter } = require('./routes/tests');
const { mainsRouter } = require('./routes/mains');
const { aiRouter } = require('./routes/ai');
const { paymentsRouter } = require('./routes/payments');
const { classroomRouter } = require('./routes/classroom');
const { studentRouter } = require('./routes/student');
const { adminRouter } = require('./routes/admin');

const app = express();

// 1. Cross-Origin Resource Sharing (CORS)
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-user-role', 'Accept'],
}));

// 2. Request Parsing
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// 3. Request Logging
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} -> ${res.statusCode} (${Date.now() - start}ms)`);
  });
  next();
});

// 4. Mounting API Routers

// Health Check
app.use('/api/health', healthRouter);

// Authentication & Users (Both /api/auth and /api/v1/auth)
app.use('/api/auth', authRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api', authRouter); // Covers /api/send-welcome-email

// Study & Courses (Covers /api/courses and /api/study/*)
app.use('/api', coursesRouter);

// Current Affairs (Both /api/current-affairs and /api/v1/current-affairs)
app.use('/api/current-affairs', currentAffairsRouter);
app.use('/api/v1/current-affairs', currentAffairsRouter);

// Tests & Mock Tests (Both /api/tests and /api/v1/tests)
app.use('/api/tests', testsRouter);
app.use('/api/v1/tests', testsRouter);

// Mains Evaluation & Faculty Review
app.use('/api/mains', mainsRouter);
app.use('/api', mainsRouter); // Covers /api/admin/mains-submissions, /api/admin/mains-evaluate/:id

// Groq Academic AI (Chat, Tutor, Doubt Clearance)
app.use('/api/ai', aiRouter);
app.use('/api/v1/ai', aiRouter);

// Payments, Orders & Subscriptions
app.use('/api', paymentsRouter); // Covers /api/create-order, /api/v1/payment/*, /api/subscriptions/*, /api/v1/orders

// Classroom, Secure Streaming, Downloadable Notes, Live Classes
app.use('/api/v1', classroomRouter);
app.use('/api', classroomRouter); // Covers /api/study-materials, /api/videos

// Student Dashboard, Reminders, Reviews, Preferences
app.use('/api/v1', studentRouter);

// Platform Administration & CMS
app.use('/api/admin', adminRouter);
app.use('/api/v1/admin', adminRouter);
app.use('/api/cms', adminRouter);

const path = require('path');
const fs = require('fs');

// Serve built React Web Frontend if present (Unified Single Service)
const publicDir = path.join(__dirname, '../public');
if (fs.existsSync(publicDir)) {
  app.use(express.static(publicDir));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(publicDir, 'index.html'));
  });
} else {
  // Fallback root welcome route
  app.get('/', (req, res) => {
    res.json({
      platform: 'UPSC EdTech Platform Unified Enterprise Backend',
      status: 'online',
      version: '1.0.0',
      documentation: 'Serves Flutter Mobile and React Web unified API endpoints.',
      healthEndpoint: '/api/health',
    });
  });
}

// 5. Error Handlers
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = { app };
