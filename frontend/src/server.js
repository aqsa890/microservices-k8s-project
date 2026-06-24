require('dotenv').config();
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Dynamic configuration endpoint for front-end JS
app.get('/config.js', (req, res) => {
  res.set('Content-Type', 'application/javascript');
  res.send(`window.ENV = { GATEWAY_URL: "${process.env.GATEWAY_URL || 'http://localhost:3333'}" };`);
});

// Serve static files
app.use(express.static(path.join(__dirname, '..', 'public')));

// SPA fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🎨 Frontend service running on http://localhost:${PORT}`);
});
