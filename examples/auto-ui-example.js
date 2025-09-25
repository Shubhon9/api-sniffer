/**
 * Auto-Start UI Example
 * Demonstrates automatic UI server startup with API Sniffer
 */

const express = require('express');
const { apiSniffer } = require('api-sniffer');

const app = express();

// Add body parser middleware
app.use(express.json());

// Add API Sniffer middleware with auto-start UI
app.use(apiSniffer({
  logLevel: 'full',
  maxLogs: 1000,
  maskFields: ['password', 'token'],
  
  // Auto-start UI server options
  autoStartUI: true,    // Automatically start UI server
  uiPort: 3333,         // UI server port
  uiHost: 'localhost',  // UI server host
  uiOpen: true,         // Automatically open UI in browser
  showAsciiLogo: true   // Show ASCII logo on startup (default: true)
}));

// Sample routes
app.get('/', (req, res) => {
  res.json({ 
    message: 'Auto-Start UI Example', 
    timestamp: new Date().toISOString(),
    features: ['Auto-Start UI', 'Browser Auto-Open', 'Zero Configuration']
  });
});

app.get('/api/users', (req, res) => {
  res.json({ 
    users: [
      { id: 1, name: 'Alice', email: 'alice@example.com' },
      { id: 2, name: 'Bob', email: 'bob@example.com' }
    ] 
  });
});

app.post('/api/users', (req, res) => {
  const user = {
    id: Date.now(),
    ...req.body,
    created: new Date().toISOString()
  };
  res.status(201).json({ user, message: 'User created successfully' });
});

// Route with sensitive data (will be masked)
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  
  // This will be automatically masked by api-sniffer
  res.json({
    token: 'secret-jwt-token-here',
    user: { username },
    expires: new Date(Date.now() + 3600000).toISOString()
  });
});

// Route that will cause an error
app.get('/api/error', (req, res) => {
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log('📊 API Sniffer is monitoring all requests');
  console.log('🌐 UI Dashboard will start automatically on port 3333');
  console.log('🚀 Browser will open automatically to the dashboard');
  
  console.log('\n📋 Available endpoints:');
  console.log('  GET  /');
  console.log('  GET  /api/users');
  console.log('  POST /api/users');
  console.log('  POST /api/auth/login');
  console.log('  GET  /api/error');
  
  console.log('\n💡 Features demonstrated:');
  console.log('  • Automatic UI server startup');
  console.log('  • Browser auto-open');
  console.log('  • Zero manual configuration');
  console.log('  • Sensitive data masking');
  
  
  console.log('\n🎯 Make some requests to see the dashboard in action:');
  console.log(`  curl http://localhost:${PORT}/`);
  console.log(`  curl http://localhost:${PORT}/api/users`);
  console.log(`  curl -X POST http://localhost:${PORT}/api/users -H "Content-Type: application/json" -d '{"name":"Charlie","email":"charlie@example.com"}'`);
  console.log(`  curl -X POST http://localhost:${PORT}/api/auth/login -H "Content-Type: application/json" -d '{"username":"admin","password":"secret123"}'`);
  console.log(`  curl http://localhost:${PORT}/api/error`);
});


