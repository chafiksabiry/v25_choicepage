const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 5173;

// Serve static files from dist/choicepage
app.use('/choicepage', express.static(path.join(__dirname, 'dist/choicepage')));

// Handle all routes for SPA
app.get('/choicepage/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/choicepage/index.html'));
});

// Redirect root to choicepage
app.get('/', (req, res) => {
  res.redirect('/choicepage');
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
}); 