const express = require('express');
const path = require('path');
const cors = require('cors');
const compression = require('compression');

const app = express();
const PORT = process.env.PORT || 5173;

// Enable CORS and compression
app.use(cors());
app.use(compression());

// Handle asset routes first
app.get('/app2/assets/*', (req, res, next) => {
  const filePath = path.join(__dirname, 'dist', req.path.replace('/app2/', ''));
  if (path.extname(filePath) === '.js') {
    res.set('Content-Type', 'application/javascript; charset=utf-8');
  }
  res.sendFile(filePath, (err) => {
    if (err) next();
  });
});

app.get('/choicepage/assets/*', (req, res, next) => {
  const filePath = path.join(__dirname, 'dist', req.path.replace('/choicepage/', ''));
  if (path.extname(filePath) === '.js') {
    res.set('Content-Type', 'application/javascript; charset=utf-8');
  }
  res.sendFile(filePath, (err) => {
    if (err) next();
  });
});

// Serve static files with proper MIME types
app.use(express.static(path.join(__dirname, 'dist'), {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.js')) {
      res.set('Content-Type', 'application/javascript; charset=utf-8');
    } else if (filePath.endsWith('.css')) {
      res.set('Content-Type', 'text/css; charset=utf-8');
    } else if (filePath.endsWith('.html')) {
      res.set('Content-Type', 'text/html; charset=utf-8');
    }
  },
  index: false // Don't automatically serve index.html for directories
}));

// Handle SPA routing - must be after static file handling
app.get('*', (req, res) => {
  res.set('Content-Type', 'text/html; charset=utf-8');
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 