const autocannon = require('autocannon');

const optimizedTests = [
  {
    name: 'Categories API (Optimized)',
    url: 'http://localhost:5000/api/categories',
    connections: 50,
    duration: 60
  },
  {
    name: 'Products API (Cached)',
    url: 'http://localhost:5000/api/products',
    connections: 100,
    duration: 60
  }
];

async function testOptimizations() {
  console.log('🚀 Testing Optimized System\n');
  
  for (const test of optimizedTests) {
    console.log(`Testing: ${test.name}`);
    
    const result = await autocannon(test);
    
    console.log(`📊 Results:`);
    console.log(`  Requests/sec: ${result.requests.average}`);
    console.log(`  Latency avg: ${result.latency.average}ms`);
    console.log(`  Latency p99: ${result.latency.p99}ms`);
    console.log(`  Errors: ${result.errors}`);
    
    // Performance targets
    const targets = {
      latency: result.latency.average < 200,
      p99: result.latency.p99 < 500,
      throughput: result.requests.average > 1000,
      errors: result.errors === 0
    };
    
    console.log(`✅ Scalability Check:`);
    console.log(`  Latency < 200ms: ${targets.latency ? '✅' : '❌'}`);
    console.log(`  P99 < 500ms: ${targets.p99 ? '✅' : '❌'}`);
    console.log(`  Throughput > 1000: ${targets.throughput ? '✅' : '❌'}`);
    console.log(`  Zero errors: ${targets.errors ? '✅' : '❌'}`);
    console.log('─'.repeat(50));
  }
}

testOptimizations();