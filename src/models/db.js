/**
 * PostgreSQL connection pool.
 * Gracefully degrades if no database is available (MVP dev mode).
 */

const { Pool } = require('pg');
const config = require('../config');

const pool = new Pool({
  connectionString: config.db.connectionString,
});

pool.on('error', (err) => {
  console.warn('[db] Pool error (non-fatal in dev):', err.message);
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
};
