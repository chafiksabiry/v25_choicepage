const express = require('express');
const cors = require('cors');
const path = require('path');
const compression = require('compression');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5173;

// Enable CORS and compression
app.use(cors());
app.use(compression());

// Debug middleware to log requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Handle JavaScript files specifically
app.get(['*/assets/*.js', '*.js'], (req, res, next) => {
  const filePath = path.join(__dirname, 'dist', req.path.replace(/^\/choicepage\//, ''));
  
  if (fs.existsSync(filePath)) {
    console.log(`Serving JavaScript file: ${filePath}`);
    res.set('Content-Type', 'application/javascript; charset=utf-8');
    res.sendFile(filePath);
  } else {
    console.log(`File not found: ${filePath}`);
    next();
  }
});

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, 'dist'), {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.js')) {
      res.set('Content-Type', 'application/javascript; charset=utf-8');
    }
  }
}));

// SPA fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 