/**
 * TypeScript Example - API Sniffer with TypeScript
 * Demonstrates type-safe API monitoring with automatic dashboard
 */

import express, { Request, Response } from 'express';
// @ts-ignore - api-sniffer types are not fully exported
import { apiSniffer, FileStore } from 'api-sniffer';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

interface ApiSnifferOptions {
  logLevel?: 'minimal' | 'headers-only' | 'full';
  maxLogs?: number;
  maskFields?: string[];
  fileStore?: boolean;
  filePath?: string;
  store?: FileStore;
}

interface LogEntry {
  request: {
    method: string;
    path: string;
    query?: Record<string, any>;
    ip?: string;
    headers?: string;
    body?: string;
  };
  response: {
    statusCode: number;
    headers?: string;
    body?: string;
  };
  responseTime: number;
  timestamp: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  created?: string;
}

interface LoginRequest {
  username: string;
  password: string;
}

interface LoginResponse {
  token: string;
  user: { username: string };
  expires: string;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const CONFIG = {
  PORT: process.env.PORT || 3000,
  UI_PORT: 3333,
  LOG_FILE: './typescript-logs.json',
  MAX_LOGS: 2000,
  MASK_FIELDS: ['password', 'token', 'secret', 'apiKey', 'authorization'] as string[]
};

const SAMPLE_USERS: User[] = [
  { id: 1, name: 'Alice', email: 'alice@example.com' },
  { id: 2, name: 'Bob', email: 'bob@example.com' }
];

// ============================================================================
// SETUP
// ============================================================================

const app = express();

// Middleware
app.use(express.json());

// Create custom store
const customStore = new FileStore({
  filePath: CONFIG.LOG_FILE,
  maxSize: CONFIG.MAX_LOGS,
  maskFields: CONFIG.MASK_FIELDS
});

// Configure API Sniffer
const snifferOptions: ApiSnifferOptions = {
  logLevel: 'full',
  maxLogs: CONFIG.MAX_LOGS,
  maskFields: CONFIG.MASK_FIELDS,
  store: customStore
};

app.use(apiSniffer(snifferOptions));

// ============================================================================
// EVENT HANDLERS
// ============================================================================

customStore.on('newLog', (logEntry: LogEntry) => {
  const { method, path } = logEntry.request;
  const { statusCode } = logEntry.response;
  console.log(`📥 ${method} ${path} -> ${statusCode}`);
});

// ============================================================================
// ROUTE HANDLERS
// ============================================================================

const handleRoot = (req: Request, res: Response): void => {
  res.json({
    message: 'TypeScript API Sniffer Example',
    timestamp: new Date().toISOString(),
    features: ['TypeScript Support', 'Type Safety', 'IntelliSense', 'Auto Dashboard']
  });
};

const handleGetUsers = (req: Request, res: Response): void => {
  res.json({ users: SAMPLE_USERS });
};

const handleCreateUser = (req: Request, res: Response): void => {
  const newUser: User = {
    id: Date.now(),
    ...req.body,
    created: new Date().toISOString()
  };
  
  res.status(201).json({
    user: newUser,
    message: 'User created successfully'
  });
};

const handleLogin = (req: Request<{}, LoginResponse, LoginRequest>, res: Response): void => {
  const { username } = req.body;
  
  // Sensitive data will be automatically masked by api-sniffer
  const response: LoginResponse = {
    token: 'secret-jwt-token-here',
    user: { username },
    expires: new Date(Date.now() + 3600000).toISOString()
  };
  
  res.json(response);
};

const handleStats = (req: Request, res: Response): void => {
  const stats = apiSniffer.utils.getStats();
  const recentLogs = apiSniffer.utils.getLogs({ limit: 5 });
  
  res.json({
    statistics: stats,
    recentLogs: recentLogs.map((log: LogEntry) => ({
      method: log.request.method,
      path: log.request.path,
      status: log.response.statusCode,
      time: log.responseTime,
      timestamp: log.timestamp
    }))
  });
};

const handleErrorLogs = (req: Request, res: Response): void => {
  const errorLogs = apiSniffer.utils.getLogs({
    statusCode: 500,
    limit: 10
  });
  
  res.json({
    errorLogs: errorLogs.map((log: LogEntry) => ({
      method: log.request.method,
      path: log.request.path,
      timestamp: log.timestamp,
      responseTime: log.responseTime
    }))
  });
};

// ============================================================================
// ROUTES
// ============================================================================

app.get('/', handleRoot);
app.get('/api/users', handleGetUsers);
app.post('/api/users', handleCreateUser);
app.post('/api/auth/login', handleLogin);
app.get('/api/stats', handleStats);
app.get('/api/logs/errors', handleErrorLogs);

// ============================================================================
// SERVER STARTUP
// ============================================================================

const startServer = async (): Promise<void> => {
  try {
    // Start main server
    app.listen(CONFIG.PORT, () => {
      console.log(`✅ TypeScript server running on http://localhost:${CONFIG.PORT}`);
      console.log('📊 API Sniffer with TypeScript support is monitoring all requests');
    });

    // Start UI dashboard
    const uiResult = await apiSniffer.startUI({
      port: CONFIG.UI_PORT,
      store: customStore
    });
    
    console.log(`✅ UI Dashboard started at: ${uiResult.dashboardUrl}`);
    console.log('\n📋 Available endpoints:');
    console.log('  GET  /');
    console.log('  GET  /api/users');
    console.log('  POST /api/users');
    console.log('  POST /api/auth/login');
    console.log('  GET  /api/stats');
    console.log('  GET  /api/logs/errors');
    
    console.log('\n💡 TypeScript features demonstrated:');
    console.log('  • Full type safety with interfaces');
    console.log('  • Proper typing for requests/responses');
    console.log('  • IntelliSense support in your IDE');
    console.log('  • Compile-time error checking');
    console.log('  • Organized code structure');
    
  } catch (error) {
    console.error('❌ Failed to start UI server:', (error as Error).message);
    console.log('💡 You can start it manually with: npx api-sniffer ui');
  }
};

// ============================================================================
// CLEANUP
// ============================================================================

const cleanup = (): void => {
  console.log('\n👋 Shutting down server...');
  customStore.destroy();
  process.exit(0);
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);

// ============================================================================
// START APPLICATION
// ============================================================================

startServer().catch((error) => {
  console.error('❌ Failed to start application:', error);
  process.exit(1);
});