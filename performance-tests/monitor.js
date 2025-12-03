const os = require('os');
const { performance } = require('perf_hooks');

class PerformanceMonitor {
  constructor() {
    this.metrics = {
      requests: 0,
      errors: 0,
      responseTimes: [],
      startTime: Date.now()
    };
  }

  // Middleware for Express
  middleware() {
    return (req, res, next) => {
      const start = performance.now();
      
      res.on('finish', () => {
        const duration = performance.now() - start;
        this.recordRequest(duration, res.statusCode);
      });
      
      next();
    };
  }

  recordRequest(duration, statusCode) {
    this.metrics.requests++;
    this.metrics.responseTimes.push(duration);
    
    if (statusCode >= 400) {
      this.metrics.errors++;
    }
    
    // Keep only last 1000 response times
    if (this.metrics.responseTimes.length > 1000) {
      this.metrics.responseTimes.shift();
    }
  }

  getStats() {
    const uptime = Date.now() - this.metrics.startTime;
    const responseTimes = this.metrics.responseTimes;
    
    return {
      uptime: Math.floor(uptime / 1000),
      requests: this.metrics.requests,
      errors: this.metrics.errors,
      errorRate: (this.metrics.errors / this.metrics.requests * 100).toFixed(2),
      avgResponseTime: responseTimes.length ? 
        (responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length).toFixed(2) : 0,
      p95ResponseTime: this.percentile(responseTimes, 95).toFixed(2),
      requestsPerSecond: (this.metrics.requests / (uptime / 1000)).toFixed(2),
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024)
      },
      cpu: process.cpuUsage(),
      system: {
        loadAvg: os.loadavg(),
        freeMem: Math.round(os.freemem() / 1024 / 1024),
        totalMem: Math.round(os.totalmem() / 1024 / 1024)
      }
    };
  }

  percentile(arr, p) {
    if (arr.length === 0) return 0;
    const sorted = arr.slice().sort((a, b) => a - b);
    const index = Math.ceil(sorted.length * p / 100) - 1;
    return sorted[index];
  }

  startReporting(interval = 30000) {
    setInterval(() => {
      console.log('📊 Performance Stats:', JSON.stringify(this.getStats(), null, 2));
    }, interval);
  }
}

module.exports = PerformanceMonitor;