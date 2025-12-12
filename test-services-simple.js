const http = require('http');

function testService(host, port, path, name) {
  return new Promise((resolve) => {
    const req = http.get(`http://${host}:${port}${path}`, (res) => {
      console.log(`✅ ${name}: OK (${res.statusCode})`);
      resolve(true);
    });
    
    req.on('error', (err) => {
      console.log(`❌ ${name}: FAILED - ${err.message}`);
      resolve(false);
    });
    
    req.setTimeout(3000, () => {
      console.log(`❌ ${name}: TIMEOUT`);
      req.destroy();
      resolve(false);
    });
  });
}

async function testAll() {
  console.log('Testing services...\n');
  
  await testService('localhost', 8081, '/health', 'API Gateway');
  await testService('localhost', 5006, '/health', 'Product Service');
  await testService('localhost', 5002, '/health', 'Cart Service');
  await testService('localhost', 5005, '/health', 'Auth Service');
}

testAll();