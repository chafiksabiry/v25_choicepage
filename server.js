const express = require('express');
const cors = require('cors');
const path = require('path');
const compression = require('compression');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5173;

// Enable CORS and compression
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(compression());

// Debug middleware to log requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Function to set common headers
const setCommonHeaders = (res) => {
  res.set({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Cache-Control': 'public, max-age=31536000',
    'X-Content-Type-Options': 'nosniff'
  });
};

// Handle JavaScript files first
app.get(['*.js', '*/assets/*.js', '/choicepage/*.js', '/choicepage/assets/*.js'], (req, res, next) => {
  const normalizedPath = req.path.replace(/^\/choicepage\//, '');
  const filePath = path.join(__dirname, 'dist', normalizedPath);

  console.log(`[JS Request] Attempting to serve: ${filePath}`);

  if (!fs.existsSync(filePath)) {
    console.log(`[JS Request] File not found: ${filePath}`);
    return next();
  }

  setCommonHeaders(res);
  res.set('Content-Type', 'application/javascript; charset=utf-8');
  
  res.sendFile(filePath, (err) => {
    if (err) {
      console.error(`[JS Request] Error serving ${filePath}:`, err);
      next(err);
    } else {
      console.log(`[JS Request] Successfully served: ${filePath}`);
    }
  });
});

// Serve static files
app.use('/choicepage', express.static(path.join(__dirname, 'dist'), {
  setHeaders: (res, filePath) => {
    setCommonHeaders(res);
    if (filePath.endsWith('.js')) {
      res.set('Content-Type', 'application/javascript; charset=utf-8');
    }
  },
  index: false // Disable automatic index.html serving
}));

// SPA fallback - always serve index.html for any unmatched routes
app.get('*', (req, res) => {
  const indexPath = path.join(__dirname, 'dist', 'index.html');
  
  if (!req.path.startsWith('/choicepage')) {
    return res.redirect('/choicepage' + req.path);
  }

  console.log(`[Fallback] Serving index.html for: ${req.path}`);
  res.sendFile(indexPath, (err) => {
    if (err) {
      console.error('[Fallback] Error serving index.html:', err);
      res.status(500).send('Error loading application');
    }
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('[Error]', err);
  res.status(500).send('Internal Server Error');
});

app.listen(PORT, () => {
  console.log(`[Server] Running on port ${PORT}`);
  console.log(`[Server] Serving static files from: ${path.join(__dirname, 'dist')}`);
}); 