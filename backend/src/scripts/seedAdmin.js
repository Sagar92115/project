const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from backend/.env if present
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const { pool, query } = require('../config/db');

async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    console.error('❌ Error: ADMIN_EMAIL and ADMIN_PASSWORD must be defined in your .env file.');
    console.error('Example:');
    console.error('  ADMIN_EMAIL=admin@k12hunar.com');
    console.error('  ADMIN_PASSWORD=AdminPassword123!');
    process.exit(1);
  }

  try {
    console.log(`🌱 Seeding admin account: ${email}...`);

    // Hash the password with bcrypt (10 salt rounds)
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Upsert admin record into PostgreSQL (ON CONFLICT on unique email)
    const upsertQuery = `
      INSERT INTO admins (email, password_hash)
      VALUES ($1, $2)
      ON CONFLICT (email)
      DO UPDATE SET password_hash = EXCLUDED.password_hash
      RETURNING id, email, created_at;
    `;

    const result = await query(upsertQuery, [email.trim().toLowerCase(), passwordHash]);
    const admin = result.rows[0];

    console.log('✅ Admin account seeded successfully!');
    console.log(`   Admin ID: ${admin.id}`);
    console.log(`   Admin Email: ${admin.email}`);
    console.log('   Ready for admin login at /admin/login');

    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to seed admin account:', error.message);
    if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
      console.error('   Hint: Please verify your DATABASE_URL in backend/.env.');
    }
    await pool.end();
    process.exit(1);
  }
}

seedAdmin();
