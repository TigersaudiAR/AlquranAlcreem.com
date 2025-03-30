// Ultra-minimal server just to make Replit happy
// Once we get past the workflow detection issue, we can reintroduce the full server logic
import express from "express";

// Create a minimal app
const app = express();

// Root route with the critical header
app.get("/", (req, res) => {
  res.setHeader("X-Replit-Port-Ready", "true");
  res.send(`
    <html>
      <head><title>Quran App</title></head>
      <body>
        <h1>Quran App Server</h1>
        <p>Minimal server running on port 5000</p>
        <p>Server time: ${new Date().toISOString()}</p>
      </body>
    </html>
  `);
});

// Set up a few essential routes
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// Log requests for debugging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Start on port 5000
const PORT = 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.clear();
  console.log(`
  =================================================
  ✅ MINIMAL SERVER RUNNING ON PORT ${PORT}
  =================================================
  
  This is a simplified server to get past Replit workflow detection.
  Once that's working, we can restore the full application.
  `);
  
  // Log that we're alive periodically
  setInterval(() => {
    console.log(`Server heartbeat at ${new Date().toISOString()}`);
  }, 5000);
});
