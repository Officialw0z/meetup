// Load .env
require('dotenv').config();

const express = require('express');
const cors = require('cors');

// يستورد db.js عشان يعمل connect + init + seed
require('./db');

const healthRoutes = require('./routes/health');
const meetupRoutes = require('./routes/meetups');

const app = express();

// ============================
// Middleware
// ============================
app.use(
    cors({
    origin: process.env.FRONTEND_ORIGIN || '*', // غيّرها لاحقاً لدومين الفرونت
    })
);
app.use(express.json());

// ============================
// Routes
// ============================
app.use('/', healthRoutes);
app.use('/api/meetups', meetupRoutes);

// 404 لو ما لقى أي route
app.use((req, res) => {
    res.status(404).json({ error: 'Not found' });
});

// Error handler عام
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    if (res.headersSent) return next(err);
    res.status(500).json({ error: 'Internal server error' });
});

// ============================
// Start Server
// ============================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
