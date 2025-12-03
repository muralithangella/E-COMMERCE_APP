const { spawn } = require('child_process');

console.log('🔍 Checking Redis installation...\n');

// Check if Redis is installed
const checkRedis = spawn('redis-server', ['--version'], { stdio: 'pipe' });

checkRedis.stdout.on('data', (data) => {
  console.log('✅ Redis is installed:', data.toString().trim());
  console.log('\n💡 Start Redis with: redis-server');
  console.log('💡 Test Redis with: redis-cli ping');
});

checkRedis.stderr.on('data', (data) => {
  console.log('⚠️  Redis output:', data.toString().trim());
});

checkRedis.on('error', () => {
  console.log('❌ Redis not found in PATH');
  console.log('\n📦 Install Redis:');
  console.log('1. Download: https://github.com/microsoftarchive/redis/releases');
  console.log('2. Or use Chocolatey: choco install redis-64');
  console.log('3. Or use WSL: wsl sudo apt install redis-server');
});

checkRedis.on('close', (code) => {
  if (code === 0) {
    // Try to ping Redis
    console.log('\n🔍 Testing Redis connection...');
    const ping = spawn('redis-cli', ['ping'], { stdio: 'pipe' });
    
    ping.stdout.on('data', (data) => {
      if (data.toString().trim() === 'PONG') {
        console.log('✅ Redis is running and responding');
      } else {
        console.log('⚠️  Redis response:', data.toString().trim());
      }
    });
    
    ping.on('error', () => {
      console.log('❌ Redis server not running');
      console.log('💡 Start with: redis-server');
    });
  }
});