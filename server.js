const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5173;

// Debug logging middleware
app.use((req, res, next) => {
  console.log(`[Server] ${req.method} ${req.path}`);
  next();
});

// Serve static files from the dist directory
app.use('/choicepage', express.static(path.join(__dirname, 'dist')));
app.use('/', express.static(path.join(__dirname, 'dist')));

// Special handling for assets to ensure correct mime types
app.get('/choicepage/assets/*', (req, res, next) => {
  const filePath = path.join(__dirname, 'dist', req.path.replace('/choicepage', ''));
  
  if (fs.existsSync(filePath)) {
    const ext = path.extname(filePath).toLowerCase();
    
    // Set correct MIME types
    if (ext === '.js') {
      res.setHeader('Content-Type', 'application/javascript');
    } else if (ext === '.css') {
      res.setHeader('Content-Type', 'text/css');
    }
    
    res.sendFile(filePath);
  } else {
    next();
  }
});

// Fallback route for SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Application available at http://localhost:${PORT}/choicepage`);
});