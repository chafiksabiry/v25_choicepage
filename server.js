const express = require('express');
const cors = require('cors');
const path = require('path');
const compression = require('compression');

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

// Serve static files from the dist directory with proper MIME types
app.use('/choicepage', express.static(path.join(__dirname, 'dist'), {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.js')) {
      res.set('Content-Type', 'application/javascript; charset=utf-8');
    }
    // Enable CORS for all static files
    res.set('Access-Control-Allow-Origin', '*');
    // Add cache control headers
    res.set('Cache-Control', 'public, max-age=31536000');
  }
}));

// Handle JavaScript files specifically
app.get(['/choicepage/assets/*.js', '/choicepage/*.js'], (req, res, next) => {
  const relativePath = req.path.replace('/choicepage/', '');
  const filePath = path.join(__dirname, 'dist', relativePath);
  
  console.log(`Attempting to serve JS file: ${filePath}`);
  
  res.set('Content-Type', 'application/javascript; charset=utf-8');
  res.set('Access-Control-Allow-Origin', '*');
  res.sendFile(filePath, (err) => {
    if (err) {
      console.error(`Error serving ${filePath}:`, err);
      next();
    }
  });
});

// SPA fallback - always serve index.html for any unmatched routes
app.get('*', (req, res) => {
  if (!req.path.startsWith('/choicepage')) {
    res.redirect('/choicepage' + req.path);
  } else {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Serving static files from: ${path.join(__dirname, 'dist')}`);
}); 