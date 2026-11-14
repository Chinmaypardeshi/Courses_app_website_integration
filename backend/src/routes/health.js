const { Router } = require('express');
const { pool } = require('../db/pool');

const healthRouter = Router();

healthRouter.get('/', async (req, res) => {
  let dbStatus = 'disconnected';
  try {
    const resDb = await pool.query('SELECT 1');
    if (resDb.rowCount > 0) dbStatus = 'connected';
  } catch (e) {
    dbStatus = `error: ${e.message}`;
  }

  return res.status(200).json({
    status: 'online',
    timestamp: new Date().toISOString(),
    platform: 'UPSC EdTech Platform Enterprise Unified Backend',
    database: dbStatus,
    clientsSupported: ['Flutter Mobile (Android/iOS)', 'React Web (Vite)'],
  });
});

module.exports = { healthRouter };
