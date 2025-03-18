const express = require('express');
const cors = require('cors');
const path = require('path');
const compression = require('compression');
const fs = require('fs');
//const systemjs = require('systemjs');

const app = express();
const PORT = process.env.PORT || 5173;

// Enable CORS and compression
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS', 'HEAD'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
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
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, HEAD',
    'Cache-Control': 'public, max-age=31536000',
    'X-Content-Type-Options': 'nosniff'
  });
};

// Function to check if file exists and get its stats
const getFileInfo = (filePath) => {
  try {
    const stats = fs.statSync(filePath);
    return { exists: true, stats };
  } catch (err) {
    return { exists: false, stats: null };
  }
};

// Handle JavaScript files first with proper MIME type
app.get(['*.js', '*/assets/*.js', '/choicepage/*.js', '/choicepage/assets/*.js'], (req, res, next) => {
  const normalizedPath = req.path.replace(/^\/choicepage\//, '');
  const filePath = path.join(__dirname, 'dist', normalizedPath);
  
  console.log(`[JS Request] Processing request for: ${req.path}`);
  console.log(`[JS Request] Normalized path: ${normalizedPath}`);
  console.log(`[JS Request] Full file path: ${filePath}`);

  const fileInfo = getFileInfo(filePath);
  if (!fileInfo.exists) {
    console.log(`[JS Request] File not found: ${filePath}`);
    return next();
  }

  console.log(`[JS Request] File found: ${filePath}`);
  console.log(`[JS Request] File size: ${fileInfo.stats.size} bytes`);

  // Set proper headers for JavaScript files
  setCommonHeaders(res);
  res.set({
    'Content-Type': 'application/javascript; charset=utf-8',
    'Content-Length': fileInfo.stats.size
  });

  // Handle HEAD requests
  if (req.method === 'HEAD') {
    console.log(`[JS Request] Responding to HEAD request for: ${filePath}`);
    return res.end();
  }

  // Stream the file
  const stream = fs.createReadStream(filePath);
  stream.on('error', (err) => {
    console.error(`[JS Request] Error streaming file ${filePath}:`, err);
    next(err);
  });

  stream.pipe(res);
});

// Serve static files with proper MIME types
app.use('/choicepage', express.static(path.join(__dirname, 'dist'), {
  setHeaders: (res, filePath) => {
    setCommonHeaders(res);
    if (filePath.endsWith('.js')) {
      res.set('Content-Type', 'application/javascript; charset=utf-8');
    }
  },
  index: false
}));

// SPA fallback - always serve index.html for any unmatched routes
app.get('*', (req, res) => {
  const indexPath = path.join(__dirname, 'dist', 'index.html');
  
  if (!req.path.startsWith('/choicepage')) {
    return res.redirect('/choicepage' + req.path);
  }

  console.log(`[Fallback] Serving index.html for: ${req.path}`);
  res.set('Content-Type', 'text/html; charset=utf-8');
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