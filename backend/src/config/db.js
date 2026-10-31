const { Pool } = require('pg');
require('dotenv').config();

const connectionString = process.env.DATABASE_URL;

if (!connectionString && process.env.NODE_ENV !== 'test') {
  console.warn('⚠️ WARNING: DATABASE_URL is not set in environment variables.');
}

const isLocalhost = connectionString && (
  connectionString.includes('localhost') || 
  connectionString.includes('127.0.0.1')
);

const pool = new Pool({
  connectionString,
  ssl: isLocalhost ? false : { rejectUnauthorized: false }
});

pool.on('connect', () => {
  // Connected successfully
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle PostgreSQL client:', err);
});

module.exports = {
  pool,
  query: (text, params) => pool.query(text, params)
};
