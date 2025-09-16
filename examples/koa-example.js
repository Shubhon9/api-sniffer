/**
 * Koa Example
 * Using API Sniffer with Koa framework
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

app.listen(PORT, () => {
  console.log(`✅ Koa server running on http://localhost:${PORT}`);
  console.log('📊 API Sniffer is monitoring all requests');
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

