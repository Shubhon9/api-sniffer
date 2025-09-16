/**
 * TypeScript Example
 * Using API Sniffer with TypeScript
 */

import express, { Request, Response } from 'express';
import { apiSniffer, ApiSnifferOptions, FileStore, LogEntry } from 'api-sniffer';

const app = express();

// Add body parser middleware
app.use(express.json());

// TypeScript configuration with proper typing
const options: ApiSnifferOptions = {
  logLevel: 'full',
  maxLogs: 1000,
  maskFields: ['password', 'token', 'secret'],
  fileStore: true,
  filePath: './typescript-logs.json'
};

// Add API Sniffer middleware
app.use(apiSniffer(options));

// Create a custom store with TypeScript
const customStore = new FileStore({
  filePath: './custom-typescript-logs.json',
  maxSize: 2000,
  maskFields: ['apiKey', 'authorization']
});

// Listen for new logs with proper typing
customStore.on('newLog', (logEntry: LogEntry) => {
  console.log(`📥 New request: ${logEntry.request.method} ${logEntry.request.path} -> ${logEntry.response.statusCode}`);
});

// Sample routes with TypeScript
app.get('/', (req: Request, res: Response) => {
  res.json({ 
    message: 'TypeScript API Sniffer Example', 
    timestamp: new Date().toISOString(),
    features: ['TypeScript Support', 'Type Safety', 'IntelliSense']
  });
});

app.get('/api/users', (req: Request, res: Response) => {
  res.json({ 
    users: [
      { id: 1, name: 'Alice', email: 'alice@example.com' },
      { id: 2, name: 'Bob', email: 'bob@example.com' }
    ] 
  });
});

app.post('/api/users', (req: Request, res: Response) => {
  const user = {
    id: Date.now(),
    ...req.body,
    created: new Date().toISOString()
  };
  res.status(201).json({ user, message: 'User created successfully' });
});

// Route with sensitive data (will be masked)
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { username, password } = req.body;
  
  // This will be automatically masked by api-sniffer
  res.json({
    token: 'secret-jwt-token-here',
    user: { username },
    expires: new Date(Date.now() + 3600000).toISOString()
  });
});

// Route to demonstrate programmatic access with TypeScript
app.get('/api/stats', (req: Request, res: Response) => {
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

// Route to demonstrate filtering with TypeScript
app.get('/api/logs/errors', (req: Request, res: Response) => {
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

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  console.log(`✅ TypeScript server running on http://localhost:${PORT}`);
  console.log('📊 API Sniffer with TypeScript support is monitoring all requests');
  
  // Start UI server
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
  console.log('  GET  /api/stats');
  console.log('  GET  /api/logs/errors');
  
  console.log('\n🔥 Try these commands in another terminal:');
  console.log('  npx api-sniffer watch    # Live dashboard');
  console.log('  npx api-sniffer stats    # View stats');
  console.log('  npx api-sniffer logs     # View recent logs');
  
  console.log('\n💡 TypeScript features demonstrated:');
  console.log('  • Full type safety with ApiSnifferOptions');
  console.log('  • Proper typing for LogEntry and other interfaces');
  console.log('  • IntelliSense support in your IDE');
  console.log('  • Compile-time error checking');
});

// Cleanup on exit
process.on('SIGINT', () => {
  console.log('\n👋 Shutting down server...');
  customStore.destroy();
  process.exit(0);
});

