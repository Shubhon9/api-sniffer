/**
 * Basic Express Example
 * Simple usage of API Sniffer with Express
 */

const express = require('express');
const { apiSniffer } = require('api-sniffer');

const app = express();

// Add body parser middleware
app.use(express.json());

// Add API Sniffer middleware with basic configuration
app.use(apiSniffer({
  logLevel: 'full',
  maxLogs: 1000,
  autoStartUI: true,  // Automatically start UI server
  uiPort: 3333,       // UI server port
  uiOpen: true        // Open UI in browser automatically
}));

// Sample routes
app.get('/', (req, res) => {
  res.json({ 
    message: 'Hello World!', 
    timestamp: new Date().toISOString() 
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

app.get('/api/users/:id', (req, res) => {
  const { id } = req.params;
  
  if (id === '404') {
    return res.status(404).json({ error: 'User not found' });
  }
  
  res.json({ 
    id: parseInt(id), 
    name: 'Test User', 
    email: `user${id}@example.com` 
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log('📊 API Sniffer is monitoring all requests');
  console.log('🌐 UI Dashboard will start automatically on port 3333');
  console.log('\n📋 Available endpoints:');
  console.log('  GET  /');
  console.log('  GET  /api/users');
  console.log('  POST /api/users');
  console.log('  GET  /api/users/:id');
  
  console.log('\n🔥 Try these commands in another terminal:');
  console.log('  npx api-sniffer watch    # Live dashboard');
  console.log('  npx api-sniffer stats    # View stats');
  console.log('  npx api-sniffer logs     # View recent logs');
  
});
