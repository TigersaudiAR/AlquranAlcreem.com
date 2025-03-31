import express from 'express';
import { createServer } from 'http';
import { registerRoutes } from './routes';
import { setupVite } from './vite';
import path from 'path';
import fs from 'fs';

// Create Express application with JSON support
const app = express();
app.use(express.json());

// يصرح لجميع المسارات (CORS)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Serve static files from the public directory
app.use('/assets', express.static(path.join(process.cwd(), 'public/assets')));
app.use('/fonts', express.static(path.join(process.cwd(), 'public/fonts')));
app.use('/images', express.static(path.join(process.cwd(), 'public/images')));
app.use('/test.html', express.static(path.join(process.cwd(), 'public/test.html')));

// سجل المسارات الإضافية للتصحيح
console.log('Static paths:');
console.log(`- Assets path: ${path.join(process.cwd(), 'public/assets')}`);
console.log(`- Fonts path: ${path.join(process.cwd(), 'public/fonts')}`);
console.log(`- Images path: ${path.join(process.cwd(), 'public/images')}`);
console.log(`- Test path: ${path.join(process.cwd(), 'public/test.html')}`);

// Define port - use 5000 for Replit
const PORT = Number(process.env.PORT) || 5000;

// Set up the header for all responses
app.use((req, res, next) => {
  res.setHeader('X-Replit-Port-Ready', 'true');
  next();
});

// مسار الـ API الرئيسي - سيتم التعامل مع مسار الصفحة الرئيسية من قِبل Vite
app.get('/api', (req, res) => {
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

// التحقق من وجود ملف main.tsx
const mainTsxPath = path.resolve(process.cwd(), 'client', 'src', 'main.tsx');
if (fs.existsSync(mainTsxPath)) {
  console.log(`Found main.tsx at ${mainTsxPath}`);
} else {
  console.error(`Missing main.tsx file at ${mainTsxPath}`);
}

// Setup Vite for frontend (do this after registering our routes)
setupVite(app, server);

// Start server explicitly on 0.0.0.0 to make it externally accessible
server.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ SERVER RUNNING ON PORT ${PORT}`);
  console.log(`🚀 Server available at http://localhost:${PORT}`);

  // Log port ready indicator for Replit
  console.log('X-Replit-Port-Ready: true');
  console.log('X-Replit-Port-Ready header added to all responses');
  
  // Additional logging to indicate Replit port-ready status
  console.log(`Server is listening on port ${PORT} and ready for connections`);
});

// Log heartbeat every 3 seconds to keep console active
setInterval(() => {
  console.log(`Server heartbeat at ${new Date().toISOString()}`);
}, 3000);