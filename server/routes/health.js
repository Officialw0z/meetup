const express = require('express');
const router = express.Router();
const pool = require('../db');

// Health check
router.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

// Test DB
router.get('/db-test', async (req, res) => {
    try {
    const result = await pool.query('SELECT NOW()');
    res.json({ time: result.rows[0].now });
    } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database connection failed' });
    }
});

module.exports = router;

