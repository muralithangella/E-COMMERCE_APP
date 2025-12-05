const http = require('http');

function testAPI(path) {
  return new Promise((resolve) => {
    const req = http.request({
      hostname: 'localhost',
      port: 5000,
      path: `/api${path}`,
      method: 'GET'
    }, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        console.log(`${path}: ${res.statusCode} - ${data}`);
        resolve();
      });
    });
    req.on('error', (error) => {
      console.log(`${path}: ERROR - ${error.message}`);
      resolve();
    });
    req.end();
  });
}

async function testAll() {
  await testAPI('/products');
  await testAPI('/categories'); 
  await testAPI('/deals');
  await testAPI('/recommendations');
}

testAll();