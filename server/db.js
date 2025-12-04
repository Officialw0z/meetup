const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
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
        location TEXT NOT NULL
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

    console.log('✅ Tables are ready (users, meetups, signups)');
    } catch (err) {
    console.error('❌ Error initializing DB tables:', err.message);
    }
}

// ============================
// Seed Meetups (initial data)
// ============================
async function seedMeetups() {
    try {
    const result = await pool.query('SELECT COUNT(*) FROM meetups');
    const count = Number(result.rows[0].count);

    if (count === 0) {
        console.log('🌱 Seeding meetups table...');

        await pool.query(`
        INSERT INTO meetups (title, description, date, location)
        VALUES
            ('JavaScript Meetup', 'Learn JS basics', '2025-12-01', 'Stockholm'),
            ('React Workshop', 'Build React apps', '2025-12-10', 'Göteborg'),
            ('Node.js API Night', 'API design with Node and Express', '2025-12-15', 'Online');
        `);

        console.log('✅ Meetups successfully seeded!');
    } else {
        console.log('ℹ️ Meetups table already has data. Skipping seed.');
    }
    } catch (err) {
    console.error('❌ Error seeding meetups:', err.message);
    }
}

// ============================
// Connect + init + seed once
// ============================
(async () => {
    try {
    await pool.connect();
    console.log('✅ Connected to PostgreSQL!');
    await initDb();
    await seedMeetups();
    } catch (err) {
    console.error('❌ Database connection error:', err.message);
    }
})();

module.exports = pool;
