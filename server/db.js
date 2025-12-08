// server/db.js
require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL && process.env.DATABASE_URL.includes('localhost') 
    ? false 
    : { rejectUnauthorized: false },
});

// ============================
// Create Tables
// ============================
async function initDb() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS meetups (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        date DATE NOT NULL,
        location TEXT NOT NULL,
        host TEXT NOT NULL DEFAULT 'TBA'
      );
    `);

    // HÄR ÄR ÄNDRINGEN: Vi lägger tillbaka name och email!
    await pool.query(`
      CREATE TABLE IF NOT EXISTS signups (
        id SERIAL PRIMARY KEY,
        meetup_id INTEGER NOT NULL REFERENCES meetups(id) ON DELETE CASCADE,
        name TEXT NOT NULL,   -- Denna saknades!
        email TEXT NOT NULL,  -- Denna saknades!
        created_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(meetup_id, email) -- En email kan bara anmäla sig en gång per meetup
      );
    `);

    console.log('✅ Tables are ready (users, meetups, signups)');
  } catch (err) {
    console.error('❌ Error initializing DB tables:', err.message);
    throw err;
  }
}

// ============================
// Seed Meetups
// ============================
async function seedMeetups() {
  try {
    const result = await pool.query('SELECT COUNT(*) FROM meetups');
    const count = Number(result.rows[0].count);

    if (count === 0) {
      console.log('🌱 Seeding meetups table...');

      await pool.query(`
        INSERT INTO meetups (title, description, date, location, host)
        VALUES
          ('JavaScript Meetup', 'Learn JS basics', '2025-12-01', 'Stockholm', 'Magdalena'),
          ('React Workshop', 'Build React apps', '2025-12-10', 'Göteborg', 'Klassgruppen'),
          ('Node.js API Night', 'API design with Node and Express', '2025-12-15', 'Online', 'Läraren');
      `);

      console.log('✅ Meetups successfully seeded!');
    }
  } catch (err) {
    console.error('❌ Error seeding meetups:', err.message);
    throw err;
  }
}

// ============================
// Init DB
// ============================
(async () => {
  try {
    await initDb();
    await seedMeetups();
    console.log('✅ Connected to PostgreSQL and DB initialized!');
  } catch (err) {
    console.error('❌ Database setup error:', err.message);
  }
})();

module.exports = pool;