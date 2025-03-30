// A simple script to debug why the workflow is failing
// Run with: node workflow-debug.js

// Create a simple HTTP server
import http from 'http';

// Handle the debug process
async function debugWorkflow() {
  try {
    console.log('=== Workflow Debugging Script ===');
    console.log('Starting debug server on port 5000...');
    
    // Open the port immediately
    const server = http.createServer((req, res) => {
      // Add the critical header
      res.setHeader('X-Replit-Port-Ready', 'true');
      
      // Respond with a simple HTML page
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end('<html><body><h1>Debug server running</h1></body></html>');
    });
    
    // Start the server
    await new Promise((resolve) => {
      server.listen(5000, '0.0.0.0', () => {
        console.log('Debug server started on port 5000');
        resolve();
      });
    });
    
    // Log heartbeat periodically
    let heartbeats = 0;
    const interval = setInterval(() => {
      heartbeats++;
      console.log(`Heartbeat ${heartbeats}: Server is still running at ${new Date().toISOString()}`);
      
      if (heartbeats >= 10) {
        clearInterval(interval);
        console.log('Debug server stopping after 10 heartbeats');
        server.close();
      }
    }, 1000);
    
  } catch (error) {
    console.error('Debug server error:', error);
  }
}

// Run the debug function
debugWorkflow();