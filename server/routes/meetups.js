const express = require('express');
const router = express.Router();
const pool = require('../db');

// ============================
// GET /api/meetups
// ============================
router.get('/', async (req, res) => {
  try {
    // Vi använder hela tabellnamnet 'meetups' istället för 'm'
    const result = await pool.query(`
      SELECT 
        meetups.id, 
        meetups.title, 
        meetups.description, 
        meetups.date, 
        meetups.location, 
        meetups.host,
        COUNT(signups.id)::int AS attending
      FROM meetups
      LEFT JOIN signups ON meetups.id = signups.meetup_id
      GROUP BY meetups.id
      ORDER BY meetups.date ASC
    `);

    res.json(result.rows);
  } catch (err) {
    console.error('Get meetups error:', err);
    res.status(500).json({ error: err.message });
  }
});

// ============================
// GET /api/meetups/search
// ============================
router.get('/search', async (req, res) => {
  const q = req.query.q || '';

  try {
    const result = await pool.query(`
      SELECT 
        meetups.id, 
        meetups.title, 
        meetups.description, 
        meetups.date, 
        meetups.location, 
        meetups.host,
        COUNT(signups.id)::int AS attending
      FROM meetups
      LEFT JOIN signups ON meetups.id = signups.meetup_id
      WHERE meetups.title ILIKE $1
         OR meetups.description ILIKE $1
         OR meetups.location ILIKE $1
         OR meetups.host ILIKE $1
      GROUP BY meetups.id
      ORDER BY meetups.date ASC
    `, [`%${q}%`]);

    res.json(result.rows);
  } catch (err) {
    console.error('Search meetups error:', err);
    res.status(500).json({ error: 'Kunde inte söka meetups' });
  }
});

// ============================
// GET /api/meetups/:id
// ============================
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(`
      SELECT 
        meetups.id, 
        meetups.title, 
        meetups.description, 
        meetups.date, 
        meetups.location, 
        meetups.host,
        COUNT(signups.id)::int AS attending
      FROM meetups
      LEFT JOIN signups ON meetups.id = signups.meetup_id
      WHERE meetups.id = $1
      GROUP BY meetups.id
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Meetup not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Get meetup by id error:', err);
    res.status(500).json({ error: err.message });
  }
});

// ============================
// POST /api/meetups/:id/signup
// ============================
router.post('/:id/signup', async (req, res) => {
  const meetupId = req.params.id;
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }

  try {
    const exists = await pool.query('SELECT id FROM meetups WHERE id = $1', [meetupId]);
    if (exists.rows.length === 0) return res.status(404).json({ error: 'Meetup not found' });

    const result = await pool.query(
      `INSERT INTO signups (meetup_id, name, email) VALUES ($1, $2, $3) RETURNING id`,
      [meetupId, name, email]
    );

    res.json({ success: true, signup: result.rows[0] });
  } catch (err) {
    console.error('Signup error:', err);
    if (err.code === '23505') { 
        return res.status(409).json({ error: 'Du är redan anmäld till denna meetup' });
    }
    res.status(500).json({ error: 'Signup failed' });
  }
});

// ============================
// DELETE /api/meetups/:id/signup
// ============================
router.delete('/:id/signup', async (req, res) => {
  const meetupId = req.params.id;
  const { email } = req.body;

  if (!email) return res.status(400).json({ error: 'email krävs' });

  try {
    const result = await pool.query(
      `DELETE FROM signups WHERE meetup_id = $1 AND email = $2 RETURNING id`,
      [meetupId, email]
    );

    if (result.rowCount === 0) return res.status(404).json({ error: 'Ingen anmälan hittades' });

    res.json({ success: true });
  } catch (err) {
    console.error('Unregister error:', err);
    res.status(500).json({ error: 'Kunde inte avregistrera' });
  }
});

module.exports = router;