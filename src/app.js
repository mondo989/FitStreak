// src/app.js

require('dotenv').config();

const express = require('express');
const dotenv = require('dotenv');
const path = require('path');

// Initialize dotenv for environment variable management
dotenv.config();

// Initialize Express
const app = express();

// Middleware for static files
app.use(express.static(path.join(__dirname, '../public')));

// Middleware for JSON parsing
app.use(express.json());

// Import and Initialize Telegram Bot
const bot = require('./bot');
bot.launch();

// Import Firebase Service
const firebaseService = require('./services/firebaseService');

// API Endpoints (For local application)
app.get('/api/metrics', async (req, res) => {
  const metrics = await firebaseService.fetchMetrics();
  res.json(metrics);
});

// Start Express server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
