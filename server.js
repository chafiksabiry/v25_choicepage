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
app.get(['/index.js', '/choicepage/index.js'], (req, res) => {
  const filePath = path.join(__dirname, 'dist', 'index.js');
  
  // Check if file exists
  if (fs.existsSync(filePath)) {
    console.log(`Serving index.js with explicit JavaScript MIME type for path: ${req.path}`);
    res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
    
    // Read the file content to log the first few characters for debugging
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      console.log(`First 100 characters of index.js: ${content.substring(0, 100)}`);
      
      // Send the file
      res.sendFile(filePath);
    } catch (error) {
      console.error('Error reading index.js:', error);
      res.status(500).send('Error reading file');
    }
  } else {
    console.error('index.js file not found at path:', filePath);
    res.status(404).send('File not found');
  }
});

// Handle requests for assets in the choicepage subdirectory
app.get('/choicepage/*', (req, res, next) => {
  // Remove the /choicepage prefix and serve from dist
  const filePath = req.path.replace(/^\/choicepage/, '');
  console.log(`Handling choicepage request: ${req.path} -> ${filePath}`);
  
  // Check if the file exists in dist
  const fullPath = path.join(__dirname, 'dist', filePath);
  if (fs.existsSync(fullPath)) {
    // Set appropriate MIME type
    if (fullPath.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
    } else if (fullPath.endsWith('.css')) {
      res.setHeader('Content-Type', 'text/css; charset=utf-8');
    }
    res.sendFile(fullPath);
  } else {
    console.log(`File not found: ${fullPath}, falling back to index.html`);
    next();
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
    
    // Check if index.js exists and log its size
    const indexJsPath = path.join(__dirname, 'dist', 'index.js');
    if (fs.existsSync(indexJsPath)) {
      const stats = fs.statSync(indexJsPath);
      console.log(`index.js exists, size: ${stats.size} bytes`);
      
      // Log the first few characters of index.js
      const content = fs.readFileSync(indexJsPath, 'utf8');
      console.log(`First 100 characters of index.js: ${content.substring(0, 100)}`);
    } else {
      console.error('index.js does not exist in dist directory');
    }
  } catch (error) {
    console.error('Error reading dist directory:', error);
  }
}); 