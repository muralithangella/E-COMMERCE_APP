const autocannon = require('autocannon');

// Stress test for production readiness
const stressTests = [
  {
    name: 'High Load Test',
    url: 'http://localhost:5000/api/categories',
    connections: 100,
    duration: 120
  },
  {
    name: 'Extreme Load Test', 
    url: 'http://localhost:5000/api/products',
    connections: 500,
    duration: 60
  }
];

async function runStressTest() {
  console.log('🔥 STRESS TESTING - Production Load Simulation\n');
  
  for (const test of stressTests) {
    console.log(`${test.name}: ${test.connections} connections, ${test.duration}s`);
    
    const result = await autocannon(test);
    
    console.log(`📊 ${test.name} Results:`);
    console.log(`  Requests/sec: ${result.requests.average}`);
    console.log(`  Latency avg: ${result.latency.average}ms`);
    console.log(`  Latency p99: ${result.latency.p99}ms`);
    console.log(`  Errors: ${result.errors}`);
    
    const isProduction = result.latency.average < 100 && result.errors === 0;
    console.log(`  Production Ready: ${isProduction ? '✅ YES' : '❌ NO'}`);
    console.log('─'.repeat(50));
  }
}

runStressTest();