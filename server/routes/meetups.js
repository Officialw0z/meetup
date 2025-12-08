// server/routes/meetups.js
const express = require("express");
const router = express.Router();
const pool = require("../db");

// ============================
// GET /api/meetups
// User Story #17: Lista över kommande meetups
// ============================
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(`
        SELECT id, title, description, date, location, host
        FROM meetups
        ORDER BY date ASC
        `);

    res.json(result.rows);
  } catch (err) {
    console.error("Get meetups error:", err);
    res.status(500).json({ error: err.message });
  }
});

// ============================
// GET /api/meetups/search?q=...
// User Story #18: Söka efter meetups
// ============================
router.get("/search", async (req, res) => {
  const q = req.query.q || "";

  try {
    const result = await pool.query(
      `
        SELECT id, title, description, date, location, host
        FROM meetups
        WHERE title ILIKE $1
            OR description ILIKE $1
            OR location ILIKE $1
        ORDER BY date ASC
        `,
      [`%${q}%`]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("Search meetups error:", err);
    res.status(500).json({ error: "Kunde inte söka meetups" });
  }
});

// ============================
// GET /api/meetups/:id
// User Story #22: Mer info om meetup
// ============================
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `
        SELECT id, title, description, date, location, host
        FROM meetups
        WHERE id = $1
        `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Meetup not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Get meetup by id error:", err);
    res.status(500).json({ error: err.message });
  }
});

// ============================
// POST /api/meetups/:id/signup
// User Story #19: Anmäla mig
// ============================
router.post("/:id/signup", async (req, res) => {
  const meetupId = req.params.id;
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: "Name and email are required" });
  }

  try {
    // Check meetup exists
    const exists = await pool.query("SELECT id FROM meetups WHERE id = $1", [
      meetupId,
    ]);

    if (exists.rows.length === 0) {
      return res.status(404).json({ error: "Meetup not found" });
    }

    // Insert signup
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
    console.error("Signup error:", err);
    res.status(500).json({ error: "Signup failed" });
  }
});

// ============================
// DELETE /api/meetups/:id/signup
// User Story #24: Avregistrera mig
// ============================
router.delete("/:id/signup", async (req, res) => {
  const meetupId = req.params.id;
  const { email } = req.body; // or use req.query.email

  if (!email) {
    return res.status(400).json({ error: "email krävs för att avregistrera" });
  }

  try {
    const result = await pool.query(
      `
        DELETE FROM signups
        WHERE meetup_id = $1 AND email = $2
        RETURNING id
        `,
      [meetupId, email]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        error: "Ingen anmälan hittades för denna meetup och e-post",
      });
    }

    res.json({ success: true });
  } catch (err) {
    console.error("Unregister error:", err);
    res.status(500).json({
      error: "Kunde inte avregistrera dig från meetuppen",
    });
  }
});

module.exports = router;
