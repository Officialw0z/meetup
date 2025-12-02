// .env
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { Pool } = require('pg'); //PostgreSQL

const app = express();

//Render
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
    rejectUnauthorized: false, 
},
});


pool
    .connect()
    .then(async () => {
    console.log('✅ Connected to PostgreSQL!');
    await initDb();
    await seedMeetups();
    })
    .catch((err) => {
    console.error('❌ Database connection error:', err.message);
    });

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
    console.error('❌ Error while initializing DB tables:', err.message);
    }
}


async function seedMeetups() {
    try {
    const result = await pool.query('SELECT COUNT(*) FROM meetups');
    const count = Number(result.rows[0].count);

    if (count === 0) {
        console.log('🌱 Seeding meetups table with initial data...');

        await pool.query(`
        INSERT INTO meetups (title, description, date, location)
        VALUES
            ('JavaScript Meetup', 'Learn JS basics', '2025-12-01', 'Stockholm'),
            ('React Workshop', 'Build React apps', '2025-12-10', 'Göteborg'),
            ('Node.js API Night', 'API design with Node and Express', '2025-12-15', 'Online');
        `);

        console.log('✅ Meetups table seeded successfully!');
    } else {
        console.log('ℹ️ Meetups table already has data, skipping seed.');
    }
    } catch (err) {
    console.error('❌ Error while seeding meetups:', err.message);
    }
}


app.use(cors());
app.use(express.json());


app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});


app.get('/db-test', async (req, res) => {
    try {
    const result = await pool.query('SELECT NOW()');
    res.json({ time: result.rows[0].now });
    } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database connection failed' });
    }
});


app.get('/api/meetups', async (req, res) => {
    try {
    const result = await pool.query(
        'SELECT id, title, description, date, location FROM meetups ORDER BY date ASC'
    );
    res.json(result.rows);
    } catch (err) {
    res.status(500).json({ error: err.message });
    }
});


app.get('/api/meetups/:id', async (req, res) => {
    const id = req.params.id;

    try {
    const result = await pool.query(
        'SELECT id, title, description, date, location FROM meetups WHERE id = $1',
        [id]
    );

    if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Meetup not found' });
    }

    res.json(result.rows[0]);
    } catch (err) {
    res.status(500).json({ error: err.message });
    }
});


app.post('/api/meetups/:id/signup', async (req, res) => {
    const meetupId = req.params.id;
    const { name, email } = req.body;

    if (!name || !email) {
    return res
        .status(400)
        .json({ error: 'Name and email are required' });
    }

    try {
    const meetupCheck = await pool.query(
        'SELECT id FROM meetups WHERE id = $1',
        [meetupId]
    );

    if (meetupCheck.rows.length === 0) {
        return res.status(404).json({ error: 'Meetup not found' });
    }

    // نحفظ التسجيل
    const result = await pool.query(
        `INSERT INTO signups (meetup_id, name, email)
        VALUES ($1, $2, $3)
        RETURNING id, meetup_id, name, email, created_at`,
        [meetupId, name, email]
    );

    console.log(
        `📝 New signup for meetup ${meetupId}: ${name} (${email})`
    );

    res.json({ success: true, signup: result.rows[0] });
    } catch (err) {
    console.error('Error in signup:', err.message);
    res.status(500).json({ error: 'Signup failed' });
    }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});
