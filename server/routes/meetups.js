const express = require('express');
const router = express.Router();
const pool = require('../db');

// Get all meetups
router.get('/', async (req, res) => {
    try {
    const result = await pool.query(
        'SELECT id, title, description, date, location FROM meetups ORDER BY date ASC'
    );
    res.json(result.rows);
    } catch (err) {
    res.status(500).json({ error: err.message });
    }
});

// Get single meetup by ID
router.get('/:id', async (req, res) => {
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

// Signup to meetup
router.post('/:id/signup', async (req, res) => {
    const meetupId = req.params.id;
    const { name, email } = req.body;

    if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
    }

    try {
    // تأكد إن الـ meetup موجود
    const meetupCheck = await pool.query(
        'SELECT id FROM meetups WHERE id = $1',
        [meetupId]
    );

    if (meetupCheck.rows.length === 0) {
        return res.status(404).json({ error: 'Meetup not found' });
    }

    // سجّل signup
    const result = await pool.query(
        `
        INSERT INTO signups (meetup_id, name, email)
        VALUES ($1, $2, $3)
        RETURNING id, meetup_id, name, email, created_at
    `,
        [meetupId, name, email]
    );

    res.json({ success: true, signup: result.rows[0] });
} catch (err) {
    console.error('Signup error:', err.message);
    res.status(500).json({ error: 'Signup failed' });
}
});

module.exports = router;
