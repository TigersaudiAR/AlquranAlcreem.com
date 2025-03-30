import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { registerRoutes } from './routes';

// Get current directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create Express application 
const app = express();
app.use(express.json());

// Define port - using 5000 to match the Replit configuration
const PORT = 5000;

// CRITICAL: Add the X-Replit-Port-Ready header to all responses
app.use((req, res, next) => {
  res.setHeader('X-Replit-Port-Ready', 'true');
  next();
});

// Serve static files from multiple directories
// First serve from 'client' directory (for vite's development server)
const clientPath = path.join(__dirname, '..', 'client');
app.use(express.static(clientPath));
console.log(`Serving static files from: ${clientPath}`);

// Also serve from 'public' directory (for static assets)
const publicPath = path.join(__dirname, '..', 'public');
app.use(express.static(publicPath));
console.log(`Serving static files from: ${publicPath}`);

// Check if index.html exists in client directory (Vite's development entry point)
const indexPath = path.join(clientPath, 'index.html');
try {
  const stat = require('fs').statSync(indexPath);
  console.log(`Found index.html at: ${indexPath} (${stat.size} bytes)`);
} catch (err) {
  console.error(`WARNING: index.html not found at: ${indexPath}`);
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Basic API for user settings
app.get('/api/user-settings', (req, res) => {
  // Return default settings
  res.json({
    reciter: 'ar.alafasy',
    translation: 'en.sahih',
    fontSize: 1.2,
    showTranslation: true,
    autoPlayAudio: false,
    prayerMethod: 2,
    showNextPrayer: true,
    highlightCurrentVerse: true,
    autoSaveLastRead: true
  });
});

// API for Quran pages
app.get('/api/quran/page/:pageNumber', (req, res) => {
  const pageNumber = req.params.pageNumber;
  // For now, we return a stub response
  res.json({
    pageNumber: parseInt(pageNumber),
    verses: [
      { surahNumber: 1, verseNumber: 1, text: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ' },
      { surahNumber: 1, verseNumber: 2, text: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ' },
      { surahNumber: 1, verseNumber: 3, text: 'الرَّحْمَٰنِ الرَّحِيمِ' }
    ]
  });
});

// Special route for Replit to detect the port is ready
app.get('/replit/ready', (req, res) => {
  res.setHeader('X-Replit-Port-Ready', 'true');
  res.status(200).send('PORT IS READY');
});

// Register API routes (but with error handling)
try {
  registerRoutes(app);
  console.log('API routes registered successfully');
} catch (error) {
  console.error('Failed to register API routes:', error);
}

// All other routes that don't match any static files or API endpoints, 
// serve index.html (for SPA support)
app.get('*', (req, res) => {
  res.sendFile(indexPath);
});

// Start listening with a special flag to ensure port binding works
app.set('trust proxy', true);
app.set('port', PORT);

// Start server with explicit binding to all interfaces
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ SERVER RUNNING ON PORT ${PORT}`);
  console.log(`Replit header X-Replit-Port-Ready is set on all responses`);
  console.log(`Server is now available!`);
  
  // Log server information
  console.log(`Server address: ${JSON.stringify(server.address())}`);
});

// Heartbeat to keep logs active
setInterval(() => {
  console.log(`Server heartbeat at ${new Date().toISOString()}`);
}, 2000);

// Export for potential use in other files
export { app, server };
