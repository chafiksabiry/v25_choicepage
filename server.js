import express from 'express';
import path from 'path';
import cors from 'cors';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5173;

// Enable CORS for all routes
app.use(cors({
  origin: ['https://v25.harx.ai', 'http://localhost:3000', 'http://localhost:5173'],
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'access-control-allow-origin'],
  credentials: true
}));

// Debug middleware to log requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Set proper MIME types for JavaScript modules
app.use((req, res, next) => {
  if (req.path.endsWith('.js')) {
    console.log(`Setting MIME type for JavaScript file: ${req.path}`);
    res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
  } else if (req.path.endsWith('.css')) {
    console.log(`Setting MIME type for CSS file: ${req.path}`);
    res.setHeader('Content-Type', 'text/css; charset=utf-8');
  }
  next();
});

// Serve static files from the dist directory with proper MIME types
app.use(express.static(path.join(__dirname, 'dist'), {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
    } else if (filePath.endsWith('.css')) {
      res.setHeader('Content-Type', 'text/css; charset=utf-8');
    }
  }
}));

// Special handler for index.js to ensure it's served correctly
app.get('/index.js', (req, res) => {
  const filePath = path.join(__dirname, 'dist', 'index.js');
  
  // Check if file exists
  if (fs.existsSync(filePath)) {
    console.log('Serving index.js with explicit JavaScript MIME type');
    res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
    res.sendFile(filePath);
  } else {
    console.error('index.js file not found at path:', filePath);
    res.status(404).send('File not found');
  }
});

// For any other routes, serve the index.html file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Serving static files from: ${path.join(__dirname, 'dist')}`);
  
  // List files in the dist directory for debugging
  try {
    const files = fs.readdirSync(path.join(__dirname, 'dist'));
    console.log('Files in dist directory:', files);
  } catch (error) {
    console.error('Error reading dist directory:', error);
  }
}); 