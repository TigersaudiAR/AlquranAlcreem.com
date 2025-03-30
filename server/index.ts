import express from 'express';
import { Server } from 'http';

const app = express();
const PORT = Number(process.env.PORT) || 5000;

// Add the critical header
app.use((req, res, next) => {
  res.setHeader('X-Replit-Port-Ready', 'true');
  next();
});

// Add route for static files
app.use(express.static('public'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Root route
app.get('/', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Quran App Server</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 2rem;
            direction: rtl;
            text-align: center;
          }
          h1 { color: green; }
        </style>
      </head>
      <body>
        <h1>✅ الخادم يعمل بنجاح!</h1>
        <p>هذا خادم بسيط يعمل على المنفذ ${PORT}.</p>
        <p>وقت الخادم: ${new Date().toISOString()}</p>
        <hr>
        <p>تطبيق القرآن الكريم قيد التطوير</p>
      </body>
    </html>
  `);
});

// Start the server
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`
=================================================
✅ SERVER RUNNING ON PORT ${PORT}
=================================================

This server is minimal but should work with Replit's workflow detection.
Access at http://localhost:${PORT}
  `);
});

// Log heartbeat periodically
setInterval(() => {
  console.log(`Server heartbeat at ${new Date().toISOString()}`);
}, 5000);
