const autocannon = require('autocannon');

const tests = [
  {
    name: 'Categories API',
    url: 'http://localhost:5000/api/categories',
    connections: 10,
    duration: 30
  },
  {
    name: 'Products API',
    url: 'http://localhost:5000/api/products',
    connections: 10,
    duration: 30
  },
  {
    name: 'Auth Login',
    url: 'http://localhost:5000/api/auth/login',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'test@example.com', password: 'password123' }),
    connections: 5,
    duration: 20
  }
];

async function runBenchmarks() {
  console.log('🚀 Starting Performance Benchmarks\n');
  
  for (const test of tests) {
    console.log(`Testing: ${test.name}`);
    console.log(`URL: ${test.url}`);
    console.log(`Connections: ${test.connections}, Duration: ${test.duration}s\n`);
    
    try {
      const result = await autocannon(test);
      
      console.log(`📊 Results for ${test.name}:`);
      console.log(`  Requests/sec: ${result.requests.average}`);
      console.log(`  Latency avg: ${result.latency.average}ms`);
      console.log(`  Latency p99: ${result.latency.p99}ms`);
      console.log(`  Throughput: ${(result.throughput.average / 1024 / 1024).toFixed(2)} MB/s`);
      console.log(`  Errors: ${result.errors}`);
      console.log(`  Timeouts: ${result.timeouts}`);
      console.log('─'.repeat(50));
      
    } catch (error) {
      console.error(`❌ Error testing ${test.name}:`, error.message);
    }
  }
}

runBenchmarks();