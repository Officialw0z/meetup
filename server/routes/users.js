const express = require('express');
const router = express.Router();
const pool = require('../db');

// ==========================================
// POST /api/users/register
// User Story #15: Registrera
// ==========================================
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: 'username, email och password krävs' });
  }

  try {
    const result = await pool.query(
      `
      INSERT INTO users (username, email, password_hash)
      VALUES ($1, $2, $3)
      RETURNING id, username, email, created_at
      `,
      [username, email, password]
    );

    return res.status(201).json({ user: result.rows[0] });
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({
        error: 'Användare med denna e-post eller username finns redan',
      });
    }
    console.error('Register error:', err);
    return res.status(500).json({ error: 'Kunde inte registrera användaren' });
  }
});

// ==========================================
// POST /api/users/login
// User Story #16: Logga in
// ==========================================
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'email och password krävs' });
  }

  try {
    const result = await pool.query(
      'SELECT id, username, email, password_hash FROM users WHERE email = $1',
      [email]
    );

    if (result.rowCount === 0) {
      return res.status(401).json({ error: 'Fel e-post eller lösenord' });
    }

    const user = result.rows[0];

    // OBS: I skarp produktion bör bcrypt.compare användas här
    if (user.password_hash !== password) {
      return res.status(401).json({ error: 'Fel e-post eller lösenord' });
    }

    return res.json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Inloggning misslyckades' });
  }
});

// ==========================================
// GET /api/users/:email/meetups
// User Story #20: Profil – mina meetups
// ==========================================
router.get('/:email/meetups', async (req, res) => {
  const { email } = req.params;

  try {
    const result = await pool.query(
      `
      SELECT 
        m.id,
        m.title,
        m.description,
        m.date,
        m.location,
        m.host,  -- <--- HÄR LADE VI TILL VÄRDEN!
        s.created_at AS signup_at
      FROM signups s
      JOIN meetups m ON m.id = s.meetup_id
      WHERE s.email = $1
      ORDER BY m.date ASC
      `,
      [email]
    );

    return res.json(result.rows);
  } catch (err) {
    console.error('Profile meetups error:', err);
    return res.status(500).json({
      error: 'Kunde inte hämta användarens meetups',
    });
  }
});

module.exports = router;