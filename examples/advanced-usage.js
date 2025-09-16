/**
 * Advanced Usage Example
 * Demonstrates advanced features of API Sniffer
 */

const express = require('express');
const { apiSniffer, FileStore, store } = require('api-sniffer');

const app = express();

// Add body parser middleware
app.use(express.json());

// Create a custom file store with specific configuration
const customStore = new FileStore({
  filePath: './advanced-logs.json',
  maxSize: 5000,
  maskFields: ['password', 'token', 'secret', 'apiKey'],
  writeInterval: 50,
  writeBatchSize: 20,
  writeDebounceMs: 25
});

// Add API Sniffer middleware with custom store
app.use(apiSniffer({
  store: customStore,
  logLevel: 'full',
  maxLogs: 5000
}));

// Listen for new logs
customStore.on('newLog', (logEntry) => {
  console.log(`📥 New request: ${logEntry.request.method} ${logEntry.request.path} -> ${logEntry.response.statusCode}`);
});

// Listen for data refreshes
customStore.on('dataRefreshed', (data) => {
  console.log(`🔄 Data refreshed: ${data.logs.length} logs loaded`);
});

// Sample routes with different scenarios
app.get('/', (req, res) => {
  res.json({ 
    message: 'Advanced API Sniffer Example', 
    timestamp: new Date().toISOString(),
    features: ['Custom Store', 'Event Listeners', 'Programmatic Access']
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

// Route to demonstrate programmatic access
app.get('/api/stats', (req, res) => {
  const stats = apiSniffer.utils.getStats();
  const recentLogs = apiSniffer.utils.getLogs({ limit: 5 });
  
  res.json({
    statistics: stats,
    recentLogs: recentLogs.map(log => ({
      method: log.request.method,
      path: log.request.path,
      status: log.response.statusCode,
      time: log.responseTime,
      timestamp: log.timestamp
    }))
  });
});

// Route to demonstrate filtering
app.get('/api/logs/errors', (req, res) => {
  const errorLogs = apiSniffer.utils.getLogs({
    statusCode: 500,
    limit: 10
  });
  
  res.json({
    errorLogs: errorLogs.map(log => ({
      method: log.request.method,
      path: log.request.path,
      timestamp: log.timestamp,
      responseTime: log.responseTime
    }))
  });
});

// Route to demonstrate export
app.get('/api/export', (req, res) => {
  const format = req.query.format || 'json';
  const exportData = apiSniffer.utils.exportLogs(format);
  
  res.setHeader('Content-Type', format === 'json' ? 'application/json' : 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename="logs.${format}"`);
  res.send(exportData);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  console.log(`✅ Advanced server running on http://localhost:${PORT}`);
  console.log('📊 API Sniffer with custom store is monitoring all requests');
  
  // Start UI server with the custom store
  try {
    const uiResult = await apiSniffer.startUI({ 
      port: 3333, 
      store: customStore 
    });
    console.log(`✅ UI Dashboard started at: ${uiResult.dashboardUrl}`);
  } catch (error) {
    console.error('❌ Failed to start UI server:', error.message);
  }
  
  console.log('\n📋 Available endpoints:');
  console.log('  GET  /');
  console.log('  GET  /api/users');
  console.log('  POST /api/users');
  console.log('  POST /api/auth/login');
  console.log('  GET  /api/error');
  console.log('  GET  /api/stats');
  console.log('  GET  /api/logs/errors');
  console.log('  GET  /api/export?format=json');
  console.log('  GET  /api/export?format=csv');
  
  console.log('\n🔥 Try these commands in another terminal:');
  console.log('  npx api-sniffer watch    # Live dashboard');
  console.log('  npx api-sniffer stats    # View stats');
  console.log('  npx api-sniffer logs     # View recent logs');
  
  console.log('\n💡 Advanced features demonstrated:');
  console.log('  • Custom file store with specific configuration');
  console.log('  • Event listeners for real-time updates');
  console.log('  • Programmatic access to logs and statistics');
  console.log('  • Automatic masking of sensitive data');
  console.log('  • Export functionality');
  console.log('  • Error filtering');
});

// Cleanup on exit
process.on('SIGINT', () => {
  console.log('\n👋 Shutting down server...');
  customStore.destroy();
  process.exit(0);
});

