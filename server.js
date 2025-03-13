import express from 'express';
import cors from 'cors';
import path from 'path';

const app = express();
const port = 5173;

// Enable CORS for all routes
app.use(cors({
  origin: 'https://v25.harx.ai', // Allow requests from this origin
}));

// Serve static files from the 'dist' directory
app.use(express.static(path.join(path.resolve(), 'dist')));

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
}); 