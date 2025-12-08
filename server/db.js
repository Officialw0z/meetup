require("dotenv").config();
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl:
    process.env.DATABASE_URL && process.env.DATABASE_URL.includes("localhost")
      ? false
      : { rejectUnauthorized: false },
});

// ============================
// Create Tables (if not exist)
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

    await pool.query(`
        CREATE TABLE IF NOT EXISTS signups (
            id SERIAL PRIMARY KEY,
            meetup_id INTEGER NOT NULL REFERENCES meetups(id) ON DELETE CASCADE,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT NOW()
        );
        `);

    console.log("✅ Tables are ready (users, meetups, signups)");
  } catch (err) {
    console.error("❌ Error initializing DB tables:", err.message);
    throw err;
  }
}

// ============================
// Seed Meetups (initial data)
// ============================
async function seedMeetups() {
  try {
    const result = await pool.query("SELECT COUNT(*) FROM meetups");
    const count = Number(result.rows[0].count);

    if (count === 0) {
      console.log("🌱 Seeding meetups table...");

      await pool.query(`
            INSERT INTO meetups (title, description, date, location)
            VALUES
            ('JavaScript Meetup', 'Learn JS basics', '2025-12-01', 'Stockholm', 'Peter'),
            ('React Workshop', 'Build React apps', '2025-12-10', 'Göteborg' 'Klassledare'),
            ('Node.js API Night', 'API design with Node and Express', '2025-12-15', 'Your's truly');
        `);

      console.log("✅ Meetups successfully seeded!");
    } else {
      console.log("ℹ️ Meetups table already has data. Skipping seed.");
    }
  } catch (err) {
    console.error("❌ Error seeding meetups:", err.message);
    throw err;
  }
}

// ============================
// Init DB once on startup
// ============================
(async () => {
  try {
    await initDb();
    await seedMeetups();
    console.log("✅ Connected to PostgreSQL and DB initialized!");
  } catch (err) {
    console.error("❌ Database setup error:", err.message);
  }
})();

module.exports = pool;
