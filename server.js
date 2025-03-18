const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5173;

// Logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Serve static files from the current directory
app.use('/choicepage', express.static(__dirname));
app.use('/', express.static(__dirname));

// SPA fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`Application available at http://localhost:${PORT}/choicepage`);
});