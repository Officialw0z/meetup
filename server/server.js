// server/server.js
const express = require('express');
const cors = require('cors'); // Viktigt för att frontend ska få prata med backend
const app = express();

app.use(cors()); // Tillåter alla just nu (enkelt för dev)
app.use(express.json());

// En test-route
app.get('/', (req, res) => {
    res.send('API is running!');
});

// Här läser vi från .env
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});