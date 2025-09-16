/**
 * Fastify Example
 * Using API Sniffer with Fastify framework
 */

const fastify = require('fastify')({ logger: true });
const { apiSniffer } = require('api-sniffer');

// Register API Sniffer plugin
fastify.register(apiSniffer.fastify(), {
  logLevel: 'full',
  maxLogs: 1000,
  maskFields: ['password', 'token']
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
    console.log('\n📋 Available endpoints:');
    console.log('  GET  /');
    console.log('  GET  /api/users');
    console.log('  POST /api/users');
    console.log('  GET  /api/users/:id');
    
    console.log('\n🔥 Try these commands in another terminal:');
    console.log('  npx api-sniffer watch    # Live dashboard');
    console.log('  npx api-sniffer stats    # View stats');
    console.log('  npx api-sniffer logs     # View recent logs');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();

