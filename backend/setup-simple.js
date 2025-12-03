const { spawn } = require('child_process');
const colors = require('colors');

console.log('🚀 Simple Local Setup (MongoDB + Redis)'.cyan);
console.log('=' .repeat(40));

// Check if services are available
async function checkService(command, args, serviceName) {
  return new Promise((resolve) => {
    const process = spawn(command, args, { stdio: 'ignore' });
    
    process.on('error', () => {
      console.log(`❌ ${serviceName}: Not installed or not in PATH`.red);
      resolve(false);
    });
    
    process.on('close', (code) => {
      if (code === 0) {
        console.log(`✅ ${serviceName}: Available`.green);
        resolve(true);
      } else {
        console.log(`⚠️  ${serviceName}: Available but may need configuration`.yellow);
        resolve(true);
      }
    });
  });
}

async function startService(command, args, serviceName) {
  console.log(`🔄 Starting ${serviceName}...`.cyan);
  
  const process = spawn(command, args, { 
    detached: true,
    stdio: 'ignore'
  });
  
  process.unref();
  
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`✅ ${serviceName}: Started (PID: ${process.pid})`.green);
      resolve(process.pid);
    }, 2000);
  });
}

async function main() {
  console.log('\n📋 Checking available services...\n');
  
  // Check MongoDB
  const mongoAvailable = await checkService('mongod', ['--version'], 'MongoDB');
  
  // Check Redis
  const redisAvailable = await checkService('redis-server', ['--version'], 'Redis');
  
  console.log('\n📋 Service Status:');
  console.log(`MongoDB: ${mongoAvailable ? '✅ Available' : '❌ Not Available'}`.white);
  console.log(`Redis: ${redisAvailable ? '✅ Available' : '❌ Not Available'}`.white);
  
  if (!mongoAvailable && !redisAvailable) {
    console.log('\n❌ No services available. Please install MongoDB and/or Redis manually.'.red);
    console.log('\nInstallation guides:');
    console.log('MongoDB: https://docs.mongodb.com/manual/installation/');
    console.log('Redis: https://redis.io/download');
    return;
  }
  
  console.log('\n🚀 Starting available services...\n');
  
  // Start MongoDB if available
  if (mongoAvailable) {
    try {
      await startService('mongod', ['--dbpath', './data/db'], 'MongoDB');
    } catch (error) {
      console.log('⚠️  MongoDB: Please start manually with: mongod'.yellow);
    }
  }
  
  // Start Redis if available
  if (redisAvailable) {
    try {
      await startService('redis-server', [], 'Redis');
    } catch (error) {
      console.log('⚠️  Redis: Please start manually with: redis-server'.yellow);
    }
  }
  
  console.log('\n🧪 Testing connections...\n');
  
  // Test connections
  setTimeout(() => {
    const testProcess = spawn('node', ['test-local-setup.js'], { stdio: 'inherit' });
    
    testProcess.on('close', (code) => {
      if (code === 0) {
        console.log('\n🎉 Setup completed successfully!'.green);
        console.log('\nYou can now start your application:'.cyan);
        console.log('node server-local.js'.white);
      } else {
        console.log('\n⚠️  Some services may need manual configuration.'.yellow);
      }
    });
  }, 3000);
}

main().catch(console.error);