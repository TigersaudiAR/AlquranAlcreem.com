import express from 'express';
import { createServer } from 'http';
import { registerRoutes } from './routes';
import { setupVite } from './vite';

// Create Express application with JSON support
const app = express();
app.use(express.json());

// Define port
const PORT = Number(process.env.PORT) || 5000;

// Very important: Add a handler to let Replit know your port is ready
app.use((req, res, next) => {
  res.setHeader('X-Replit-Port-Ready', 'true');
  next();
});

// Basic health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Create HTTP server
const server = createServer(app);

// Add API routes
registerRoutes(app);

// Setup Vite for frontend
setupVite(app, server);

// Start listening on specified port with 0.0.0.0 to make externally available
server.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ SERVER RUNNING ON PORT ${PORT}`);
  console.log(`🚀 Server available at http://localhost:${PORT}`);
});

// Log heartbeat
setInterval(() => {
  console.log(`Server heartbeat at ${new Date().toISOString()}`);
}, 5000);
