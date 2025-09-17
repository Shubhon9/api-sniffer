/**
 * Fastify Example
 * Using API Sniffer with Fastify framework
 */

const fastify = require('fastify')({ logger: true });
const { store } = require('../src/store');

// Manual integration of API Sniffer functionality
fastify.addHook('onRequest', async (request, reply) => {
  request.startTime = Date.now();
});

fastify.addHook('onSend', async (request, reply, payload) => {
  const endTime = Date.now();
  const responseTime = endTime - request.startTime;

  // Capture request data
  const requestData = {
    method: request.method,
    path: request.url,
    query: request.query,
    ip: request.ip || request.connection?.remoteAddress || 'unknown',
    headers: request.headers
  };

  // Capture request body
  if (request.body) {
    requestData.body = request.body;
  }

  // Capture response data
  const responseData = {
    statusCode: reply.statusCode,
    headers: reply.getHeaders()
  };

  // Capture response body
  if (payload) {
    const contentType = reply.getHeader('content-type') || '';
    
    if (typeof payload === 'string') {
      responseData.body = payload;
    } else if (Buffer.isBuffer(payload)) {
      if (contentType.includes('application/json') || contentType.includes('text/')) {
        responseData.body = payload.toString('utf8');
      } else {
        responseData.body = `[${contentType || 'binary'}] ${payload.length} bytes`;
      }
    } else {
      responseData.body = payload;
    }
  }

  // Log the request/response
  store.addLog({
    request: requestData,
    response: responseData,
    responseTime,
    timestamp: new Date().toISOString()
  });

  return payload;
});

// Sample routes
fastify.get('/', async (request, reply) => {
  return { 
    message: 'Hello from Fastify!', 
    timestamp: new Date().toISOString() 
  };
});

fastify.get('/api/users', async (request, reply) => {
  return { 
    users: [
      { id: 1, name: 'Alice', email: 'alice@example.com' },
      { id: 2, name: 'Bob', email: 'bob@example.com' }
    ] 
  };
});

fastify.post('/api/users', async (request, reply) => {
  const user = {
    id: Date.now(),
    ...request.body,
    created: new Date().toISOString()
  };
  reply.status(201);
  return { user, message: 'User created successfully' };
});

fastify.get('/api/users/:id', async (request, reply) => {
  const { id } = request.params;
  
  if (id === '404') {
    reply.status(404);
    return { error: 'User not found' };
  }
  
  return { 
    id: parseInt(id), 
    name: 'Test User', 
    email: `user${id}@example.com` 
  };
});

const PORT = process.env.PORT || 3000;

const start = async () => {
  try {
    await fastify.listen({ port: PORT });
    console.log(`✅ Fastify server running on http://localhost:${PORT}`);
    console.log('📊 API Sniffer is monitoring all requests');
    
    // Start UI server
    try {
      const { apiSniffer } = require('../src/index');
      const uiResult = await apiSniffer.startUI({
        port: 3333,
        host: 'localhost'
      });
      console.log(`🌐 UI Dashboard started at: ${uiResult.dashboardUrl}`);
      console.log('🚀 Opening dashboard in browser...');
      
      // Auto-open in browser
      const { exec } = require('child_process');
      const command = process.platform === 'win32' ? 'start' : 
                     process.platform === 'darwin' ? 'open' : 'xdg-open';
      exec(`${command} ${uiResult.dashboardUrl}`);
    } catch (uiError) {
      console.warn(`⚠️  Failed to start UI server: ${uiError.message}`);
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
    console.log(`  curl http://localhost:${PORT}/api/users/404`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();

