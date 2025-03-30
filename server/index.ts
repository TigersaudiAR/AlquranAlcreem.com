import express from 'express';
import { createServer } from 'http';
import { registerRoutes } from './routes';
import { setupVite } from './vite';

// Create Express application with JSON support
const app = express();
app.use(express.json());

// Define port - make sure to use port 5000 to match the Replit configuration
const PORT = 5000;

// Set up the header for all responses
app.use((req, res, next) => {
  res.setHeader('X-Replit-Port-Ready', 'true');
  next();
});

// Respond immediately to root requests to show the server is running
app.get('/', (req, res) => {
  res.send('Quran Application API is running');
});

// Basic health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Create HTTP server
const server = createServer(app);

// Register API routes
registerRoutes(app);

// Setup Vite for frontend (do this after registering our routes)
setupVite(app, server);

// Start server explicitly on 0.0.0.0 to make it externally accessible
server.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ SERVER RUNNING ON PORT ${PORT}`);
  console.log(`🚀 Server available at http://localhost:${PORT}`);
  
  // Log port ready indicator
  console.log('X-Replit-Port-Ready header added to all responses');
});

// Log heartbeat every 3 seconds to keep console active
setInterval(() => {
  console.log(`Server heartbeat at ${new Date().toISOString()}`);
}, 3000);
