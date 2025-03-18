const express = require('express');
const path = require('path');
const compression = require('compression');
const cors = require('cors');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5173;

// Enable CORS with specific configuration for cross-origin module loading
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Enable compression
app.use(compression());

// Logging middleware with request details
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} - ${req.headers['user-agent']}`);
  next();
});

// Special handler for index.js to ensure it's always served with the correct MIME type
app.get('*/index.js', (req, res) => {
  const filePath = path.join(__dirname, 'dist', 'index.js');
  if (fs.existsSync(filePath)) {
    res.set({
      'Content-Type': 'text/javascript; charset=utf-8',
      'Cache-Control': 'no-cache',
      'X-Content-Type-Options': 'nosniff'
    });
    fs.createReadStream(filePath).pipe(res);
  } else {
    // Check the root directory as well
    const rootFilePath = path.join(__dirname, 'index.js');
    if (fs.existsSync(rootFilePath)) {
      res.set({
        'Content-Type': 'text/javascript; charset=utf-8',
        'Cache-Control': 'no-cache',
        'X-Content-Type-Options': 'nosniff'
      });
      fs.createReadStream(rootFilePath).pipe(res);
    } else {
      res.status(404).send('JavaScript file not found');
    }
  }
});

// MIME type middleware - add this before static file handling
app.use((req, res, next) => {
  const url = req.url.toLowerCase();
  
  // Set appropriate MIME types based on file extension
  if (url.endsWith('.js')) {
    res.set('Content-Type', 'text/javascript; charset=utf-8');
  } else if (url.endsWith('.mjs')) {
    res.set('Content-Type', 'text/javascript; charset=utf-8');
  } else if (url.endsWith('.css')) {
    res.set('Content-Type', 'text/css; charset=utf-8');
  } else if (url.endsWith('.json')) {
    res.set('Content-Type', 'application/json; charset=utf-8');
  }
  
  next();
});

// Serve static files with proper MIME types
const staticOptions = {
  setHeaders: (res, filepath) => {
    const ext = path.extname(filepath).toLowerCase();
    
    if (ext === '.js' || ext === '.mjs') {
      res.set('Content-Type', 'text/javascript; charset=utf-8');
    } else if (ext === '.css') {
      res.set('Content-Type', 'text/css; charset=utf-8');
    } else if (ext === '.json') {
      res.set('Content-Type', 'application/json; charset=utf-8');
    }
    
    // No caching for development
    res.set('Cache-Control', 'no-cache');
  }
};

// Serve files from dist directory first (if it exists)
if (fs.existsSync(path.join(__dirname, 'dist'))) {
  app.use('/choicepage', express.static(path.join(__dirname, 'dist'), staticOptions));
  app.use('/', express.static(path.join(__dirname, 'dist'), staticOptions));
}

// Fallback to serving from root directory
app.use('/choicepage', express.static(__dirname, staticOptions));
app.use('/', express.static(__dirname, staticOptions));

// Handle all other routes - SPA fallback
app.get('*', (req, res) => {
  const isAssetRequest = /\.(js|mjs|css|png|jpg|jpeg|gif|svg|json|ico|woff|woff2|ttf|eot)$/i.test(req.url);
  
  if (!isAssetRequest) {
    // For HTML requests, send the index.html file
    const indexPath = fs.existsSync(path.join(__dirname, 'dist', 'index.html')) 
      ? path.join(__dirname, 'dist', 'index.html')
      : path.join(__dirname, 'index.html');
      
    res.sendFile(indexPath);
  } else {
    // For asset requests that weren't found by the static middleware
    res.status(404).send('Not found');
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`Application available at http://localhost:${PORT}/choicepage`);
});