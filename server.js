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

// Logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Specifically handle the index.js file for qiankun
app.get('/choicepage/index.js', (req, res) => {
  const filePath = path.join(__dirname, 'index.js');
  if (fs.existsSync(filePath)) {
    res.setHeader('Content-Type', 'application/javascript; charset=UTF-8');
    fs.createReadStream(filePath).pipe(res);
  } else {
    res.status(404).send('JavaScript file not found');
  }
});

// Set proper MIME types for all routes
app.use((req, res, next) => {
  // Handle all JavaScript file extensions
  if (req.url.match(/\.(js|mjs)$/)) {
    res.setHeader('Content-Type', 'application/javascript; charset=UTF-8');
  } else if (req.url.endsWith('.css')) {
    res.setHeader('Content-Type', 'text/css; charset=UTF-8');
  } else if (req.url.endsWith('.json')) {
    res.setHeader('Content-Type', 'application/json; charset=UTF-8');
  }
  next();
});

// Serve static files from the current directory with proper headers
const staticOptions = {
  setHeaders: (res, filePath) => {
    if (filePath.match(/\.(js|mjs)$/)) {
      res.setHeader('Content-Type', 'application/javascript; charset=UTF-8');
    } else if (filePath.endsWith('.css')) {
      res.setHeader('Content-Type', 'text/css; charset=UTF-8');
    } else if (filePath.endsWith('.json')) {
      res.setHeader('Content-Type', 'application/json; charset=UTF-8');
    }
  }
};

app.use('/choicepage', express.static(__dirname, staticOptions));
app.use('/', express.static(__dirname, staticOptions));

// SPA fallback - only for non-asset requests
app.get('*', (req, res) => {
  // Check if request is for a file with extension and not for an asset
  const hasExtension = /\.\w+$/.test(req.url);
  const isAssetRequest = /\.(js|mjs|css|png|jpg|jpeg|gif|svg|json|ico|woff|woff2|ttf|eot)$/.test(req.url);
  
  if (!hasExtension || !isAssetRequest) {
    res.sendFile(path.join(__dirname, 'index.html'));
  } else {
    res.status(404).send('Not found');
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`Application available at http://localhost:${PORT}/choicepage`);
});