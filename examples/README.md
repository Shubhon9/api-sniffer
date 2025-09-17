# API Sniffer Examples

This directory contains various examples demonstrating different usage patterns of the API Sniffer library.

## Examples

### 1. Basic Express (`basic-express.js`)
Simple usage of API Sniffer with Express framework.

```bash
node examples/basic-express.js
```

**Features demonstrated:**
- Basic middleware setup
- Default configuration
- Simple route monitoring

### 2. Koa Example (`koa-example.js`)
Using API Sniffer with Koa framework.

```bash
node examples/koa-example.js
```

**Features demonstrated:**
- Koa-specific middleware
- Custom masking fields
- Koa route handling

### 3. Fastify Example (`fastify-example.js`)
Using API Sniffer with Fastify framework.

```bash
node examples/fastify-example.js
```

**Features demonstrated:**
- Fastify plugin registration
- Async/await patterns
- Fastify-specific configuration

### 4. Advanced Usage (`advanced-usage.js`)
Demonstrates advanced features of API Sniffer.

```bash
node examples/advanced-usage.js
```

**Features demonstrated:**
- Custom file store configuration
- Event listeners for real-time updates
- Programmatic access to logs and statistics
- Automatic masking of sensitive data
- Export functionality
- Error filtering
- UI server integration

### 5. Auto-Start UI Example (`auto-ui-example.js`)
Demonstrates automatic UI server startup with zero configuration.

```bash
node examples/auto-ui-example.js
```

**Features demonstrated:**
- Automatic UI server startup
- Browser auto-open functionality
- Zero manual configuration
- Sensitive data masking
- Real-time monitoring

### 6. TypeScript Example (`typescript-example.ts`)
Using API Sniffer with TypeScript for type safety.

```bash
# Compile TypeScript first
npx tsc examples/typescript-example.ts

# Then run
node examples/typescript-example.js
```

**Features demonstrated:**
- Full TypeScript support
- Type safety with ApiSnifferOptions
- Proper typing for LogEntry and other interfaces
- IntelliSense support
- Compile-time error checking

## Running the Examples

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run any example:**
   ```bash
   node examples/basic-express.js
   ```

3. **Test the API:**
   ```bash
   # Make some requests
   curl http://localhost:3000/
   curl http://localhost:3000/api/users
   curl -X POST http://localhost:3000/api/users -H "Content-Type: application/json" -d '{"name":"Charlie","email":"charlie@example.com"}'
   ```

4. **View the logs:**
   ```javascript
   // Access logs programmatically
   const { apiSniffer } = require('api-sniffer');
   
   // Get statistics
   const stats = apiSniffer.utils.getStats();
   console.log('Total requests:', stats.totalRequests);
   
   // Get recent logs
   const logs = apiSniffer.utils.getLogs({ limit: 10 });
   console.log('Recent logs:', logs);
   
   // Start web dashboard
   const serverInfo = await apiSniffer.startUI({ port: 3333 });
   console.log(`Dashboard: ${serverInfo.dashboardUrl}`);
   ```

## Example Features

### Basic Features
- ✅ Request/response logging
- ✅ Automatic sensitive data masking
- ✅ Statistics tracking
- ✅ Web dashboard

### Advanced Features
- ✅ Custom store configuration
- ✅ Event listeners
- ✅ Programmatic access
- ✅ Export functionality
- ✅ Error filtering
- ✅ UI server integration
- ✅ Auto-start UI server
- ✅ Browser auto-open
- ✅ TypeScript support

### Framework Support
- ✅ Express (default)
- ✅ Koa
- ✅ Fastify
- ✅ Auto-detection

## Configuration Options

Each example demonstrates different configuration options:

```javascript
// Basic configuration
app.use(apiSniffer({
  logLevel: 'full',
  maxLogs: 1000
}));

// Auto-start UI configuration
app.use(apiSniffer({
  logLevel: 'full',
  maxLogs: 1000,
  autoStartUI: true,    // Automatically start UI server
  uiPort: 3333,         // UI server port
  uiHost: 'localhost',  // UI server host
  uiOpen: true          // Open UI in browser automatically
}));

// Advanced configuration
app.use(apiSniffer({
  logLevel: 'full',
  maxLogs: 5000,
  maskFields: ['password', 'token', 'secret'],
  fileStore: true,
  filePath: './custom-logs.json',
  writeInterval: 50,
  writeBatchSize: 20,
  writeDebounceMs: 25,
  autoStartUI: true,
  uiPort: 3334,
  uiOpen: false
}));
```

## TypeScript Support

The TypeScript example shows how to use the library with full type safety:

```typescript
import { apiSniffer, ApiSnifferOptions, FileStore, LogEntry } from 'api-sniffer';

const options: ApiSnifferOptions = {
  logLevel: 'full',
  maxLogs: 1000,
  maskFields: ['password', 'token']
};

app.use(apiSniffer(options));
```

## Troubleshooting

If you encounter any issues:

1. **Port conflicts:** Change the PORT environment variable
2. **File permissions:** Ensure write permissions for log files
3. **Dependencies:** Make sure all required packages are installed
4. **TypeScript:** Ensure TypeScript is installed for TypeScript examples

## Next Steps

After running the examples:

1. **Explore the API:** Try different programmatic methods and configurations
2. **Customize configuration:** Modify the options to fit your needs
3. **Integrate with your app:** Add API Sniffer to your existing application
4. **Monitor in production:** Use the library to monitor your production APIs
