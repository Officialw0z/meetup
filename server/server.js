const express = require('express');
const cors = require('cors');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
    res.json({ status: "ok" });
});

// Fake database (temporary)
let meetups = [
    {
        id: 1,
        title: "JavaScript Meetup",
        description: "Learn JS basics",
        date: "2025-12-01",
        location: "Stockholm"
    },
    {
        id: 2,
        title: "React Workshop",
        description: "Build React apps",
        date: "2025-12-10",
        location: "Göteborg"
    }
];

// GET all meetups
app.get('/api/meetups', (req, res) => {
    res.json(meetups);
});

// GET one meetup by ID
app.get('/api/meetups/:id', (req, res) => {
    const id = Number(req.params.id);
    const meetup = meetups.find(m => m.id === id);

    if (!meetup) {
        return res.status(404).json({ error: "Meetup not found" });
    }

    res.json(meetup);
});

// POST signup to meetup
app.post('/api/meetups/:id/signup', (req, res) => {
    const id = Number(req.params.id);
    const { name, email } = req.body;

    if (!name || !email) {
        return res.status(400).json({ error: "Name and email are required" });
    }

    console.log(`New signup for meetup ${id}: ${name} (${email})`);

    res.json({ success: true });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
