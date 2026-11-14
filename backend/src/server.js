const { app } = require('./app');
const { env } = require('./config/env');
const { pool } = require('./db/pool');

const PORT = env.port;

// Verify Database Connection on startup
pool.connect((err, client, release) => {
  if (err) {
    console.error('❌ PostgreSQL Database Connection Failed:', err.message);
  } else {
    console.log('✅ PostgreSQL Database (NeonDB) Connected Successfully!');
    if (release) release();
  }
});

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Unified UPSC Backend Server is running live on port ${PORT}`);
  console.log(`📱 Flutter Mobile Base URL: http://localhost:${PORT} or http://10.0.2.2:${PORT}`);
  console.log(`🌐 React Web Base URL:    http://localhost:${PORT}/api`);
  console.log(`🩺 Health check URL:       http://localhost:${PORT}/api/health`);
});

// Graceful Shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server...');
  server.close(() => {
    pool.end();
    console.log('HTTP server and Database pool closed.');
  });
});
