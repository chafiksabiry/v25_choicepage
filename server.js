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
  const timestamp = new Date().toISOString();
  const { method, url, headers } = req;
  console.log(`[${timestamp}] ${method} ${url}`);
  console.log('[Headers]', JSON.stringify(headers, null, 2));
  next();
});

// Function to set common headers
const setCommonHeaders = (res) => {
  res.set({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, HEAD',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
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

// Specific handler for main.js
app.get(['/choicepage/assets/main.js', '/assets/main.js'], (req, res, next) => {
  const filePath = path.join(__dirname, 'dist', 'assets', 'main.js');
  console.log(`[Main.js Request] Attempting to serve: ${filePath}`);

  const fileInfo = getFileInfo(filePath);
  if (!fileInfo.exists) {
    console.error(`[Main.js Request] File not found: ${filePath}`);
    return res.status(404).send('Main.js not found');
  }

  console.log(`[Main.js Request] File found: ${filePath}`);
  console.log(`[Main.js Request] File size: ${fileInfo.stats.size} bytes`);

  // Set headers specifically for main.js
  setCommonHeaders(res);
  res.set({
    'Content-Type': 'application/javascript; charset=utf-8',
    'Content-Length': fileInfo.stats.size,
    'Cache-Control': 'no-cache, no-store, must-revalidate'
  });

  // Read and send the file
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error(`[Main.js Request] Error reading file:`, err);
      return res.status(500).send('Error reading main.js');
    }
    console.log(`[Main.js Request] Successfully read file`);
    res.send(data);
  });
});

// Handle other JavaScript files with proper MIME type
app.get(['*.js', '*/assets/*.js', '/choicepage/*.js', '/choicepage/assets/*.js'], (req, res, next) => {
  if (req.path.endsWith('/main.js')) return next(); // Skip if it's main.js

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

  setCommonHeaders(res);
  res.set({
    'Content-Type': 'application/javascript; charset=utf-8',
    'Content-Length': fileInfo.stats.size
  });

  if (req.method === 'HEAD') {
    console.log(`[JS Request] Responding to HEAD request for: ${filePath}`);
    return res.end();
  }

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
  // Skip if requesting a JavaScript file
  if (req.path.endsWith('.js')) {
    return next();
  }

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