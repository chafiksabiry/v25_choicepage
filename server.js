const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5173;

// Enable CORS
app.use(cors());

// Set proper MIME types
app.use((req, res, next) => {
  const file = req.url;
  if (file.endsWith('.js')) {
    res.set('Content-Type', 'application/javascript; charset=utf-8');
  } else if (file.endsWith('.css')) {
    res.set('Content-Type', 'text/css; charset=utf-8');
  } else if (file.endsWith('.html')) {
    res.set('Content-Type', 'text/html; charset=utf-8');
  }
  next();
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