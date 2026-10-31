const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const { pool, query } = require('../config/db');

async function initDatabase() {
  const dbUrl = process.env.DATABASE_URL;

  if (!dbUrl) {
    console.error('❌ Error: DATABASE_URL is not set in backend/.env');
    console.error('Please add your Supabase connection string to backend/.env and re-run.');
    process.exit(1);
  }

  try {
    console.log('🔄 Connecting to PostgreSQL database...');
    const schemaPath = path.resolve(__dirname, '../../schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');

    console.log('📜 Executing schema.sql on database...');
    await query(schemaSql);

    console.log('✅ Database schema initialized successfully!');
    console.log('   - admins table ready');
    console.log('   - inquiries table ready');
    console.log('   - CHECK constraints & indexes created');

    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Database initialization failed:', error.message);
    await pool.end();
    process.exit(1);
  }
}

initDatabase();
