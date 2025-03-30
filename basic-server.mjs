// A minimal server just to let Replit know that port 5000 is open
import express from 'express';

const app = express();

// Serve static root with port-ready header
app.get('/', (req, res) => {
  console.log('Root route hit at', new Date().toISOString());
  res.setHeader('X-Replit-Port-Ready', 'true');
  res.status(200).send('Port 5000 is ready and reachable');
});

// Start on port 5000, which is what Replit expects
app.listen(5000, '0.0.0.0', () => {
  console.log('Basic server running on port 5000');
});