/**
 * Koa Example with Auto-Start Dashboard
 * Using API Sniffer with Koa framework and automatic UI dashboard on port 3333
 */

const Koa = require('koa');
const Router = require('@koa/router');
const bodyParser = require('koa-bodyparser');
const { apiSniffer } = require('api-sniffer');

const app = new Koa();
const router = new Router();

// Add body parser middleware
app.use(bodyParser());

// Add API Sniffer middleware
app.use(apiSniffer.koa({
  logLevel: 'full',
  maxLogs: 1000,
  maskFields: ['password', 'token']
}));

// Sample routes
router.get('/', (ctx) => {
  ctx.body = { 
    message: 'Hello from Koa!', 
    timestamp: new Date().toISOString() 
  };
});

router.get('/api/users', (ctx) => {
  ctx.body = { 
    users: [
      { id: 1, name: 'Alice', email: 'alice@example.com' },
      { id: 2, name: 'Bob', email: 'bob@example.com' }
    ] 
  };
});

router.post('/api/users', (ctx) => {
  const user = {
    id: Date.now(),
    ...ctx.request.body,
    created: new Date().toISOString()
  };
  ctx.status = 201;
  ctx.body = { user, message: 'User created successfully' };
});

router.get('/api/users/:id', (ctx) => {
  const { id } = ctx.params;
  
  if (id === '404') {
    ctx.status = 404;
    ctx.body = { error: 'User not found' };
    return;
  }
  
  ctx.body = { 
    id: parseInt(id), 
    name: 'Test User', 
    email: `user${id}@example.com` 
  };
});

// Use router
app.use(router.routes());
app.use(router.allowedMethods());

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  console.log(`✅ Koa server running on http://localhost:${PORT}`);
  console.log('📊 API Sniffer is monitoring all requests');
  
  // Start UI server manually
  try {
    const uiResult = await apiSniffer.startUI({ 
      port: 3333, 
      host: 'localhost',
      store: apiSniffer.store
    });
    console.log(`✅ API Sniffer UI Dashboard started at: ${uiResult.dashboardUrl}`);
    
    // Auto-open in browser
    const { exec } = require('child_process');
    const command = process.platform === 'win32' ? 'start' : 
                   process.platform === 'darwin' ? 'open' : 'xdg-open';
    exec(`${command} ${uiResult.dashboardUrl}`);
    console.log('🌍 Opening dashboard in browser...');
  } catch (error) {
    console.warn(`⚠️  Failed to start UI server: ${error.message}`);
    console.log('💡 You can start it manually with: npx api-sniffer ui');
  }
  
  console.log('\n📋 Available endpoints:');
  console.log('  GET  /');
  console.log('  GET  /api/users');
  console.log('  POST /api/users');
  console.log('  GET  /api/users/:id');
  
  console.log('\n💡 Features demonstrated:');
  console.log('  • Automatic UI server startup');
  console.log('  • Browser auto-open');
  console.log('  • Zero manual configuration');
  console.log('  • Sensitive data masking');
  
  
  console.log('\n🎯 Make some requests to see the dashboard in action:');
  console.log(`  curl http://localhost:${PORT}/`);
  console.log(`  curl http://localhost:${PORT}/api/users`);
  console.log(`  curl -X POST http://localhost:${PORT}/api/users -H "Content-Type: application/json" -d '{"name":"Charlie","email":"charlie@example.com"}'`);
  console.log(`  curl http://localhost:${PORT}/api/users/1`);
  console.log(`  curl http://localhost:${PORT}/api/users/404`);
});


