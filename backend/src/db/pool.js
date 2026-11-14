const path = require('path');
const { Pool } = require('pg');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

function buildDatabaseConfig() {
  const schema = (process.env.DB_SCHEMA || 'public').trim();
  const connectionUrl = process.env.DATABASE_URL || process.env.SUPABASE_DB_URL || '';

  // Determine SSL configuration
  // Cloud providers like Supabase, Neon, AWS RDS require SSL
  const isLocal = connectionUrl.includes('localhost') || connectionUrl.includes('127.0.0.1') || (!connectionUrl && !process.env.DB_HOST);
  const sslMode = process.env.DB_SSL === 'true' || (!isLocal && process.env.DB_SSL !== 'false');

  const poolConfig = {
    max: parseInt(process.env.DB_POOL_MAX || '20', 10),
    idleTimeoutMillis: parseInt(process.env.DB_IDLE_TIMEOUT || '30000', 10),
    connectionTimeoutMillis: parseInt(process.env.DB_CONN_TIMEOUT || '10000', 10),
  };

  if (sslMode) {
    poolConfig.ssl = { rejectUnauthorized: false };
  }

  // NOTE: We deliberately do NOT put search_path in connection startup options
  // because Supabase Supavisor, PgBouncer and Neon poolers reject startup options.

  if (connectionUrl) {
    poolConfig.connectionString = connectionUrl;
  } else {
    // Fallback to granular variables (useful for AWS RDS, Supabase self-hosted, etc.)
    poolConfig.host = process.env.DB_HOST || process.env.DATABASE_HOST || 'localhost';
    poolConfig.port = parseInt(process.env.DB_PORT || process.env.DATABASE_PORT || '5432', 10);
    poolConfig.database = process.env.DB_NAME || process.env.DATABASE_NAME || 'postgres';
    poolConfig.user = process.env.DB_USER || process.env.DATABASE_USER || 'postgres';
    poolConfig.password = process.env.DB_PASSWORD || process.env.DATABASE_PASSWORD || '';
  }

  return { poolConfig, schema };
}

const { poolConfig, schema } = buildDatabaseConfig();
const pool = new Pool(poolConfig);

pool.on('error', (err) => {
  console.error('Unexpected error on idle client in PostgreSQL pool:', err.message);
});

module.exports = {
  pool,
  targetSchema: schema,
};
