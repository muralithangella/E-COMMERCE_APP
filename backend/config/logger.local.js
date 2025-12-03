const winston = require('winston');
const path = require('path');
const colors = require('colors');

// Custom format for console output with colors
const consoleFormat = winston.format.combine(
  winston.format.timestamp({ format: 'HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.printf(({ timestamp, level, message, service, ...meta }) => {
    const colorMap = {
      error: 'red',
      warn: 'yellow',
      info: 'cyan',
      debug: 'green',
      verbose: 'blue'
    };
    
    const coloredLevel = level.toUpperCase()[colorMap[level] || 'white'];
    const serviceName = service ? `[${service}]`.magenta : '';
    
    let output = `${timestamp.gray} ${coloredLevel} ${serviceName} ${message}`;
    
    // Add metadata if present
    if (Object.keys(meta).length > 0) {
      output += '\\n' + JSON.stringify(meta, null, 2).gray;
    }
    
    return output;
  })
);

// File format for structured logging
const fileFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

// Create logger instance
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'debug',
  defaultMeta: { 
    service: process.env.SERVICE_NAME || 'ecommerce-api',
    environment: process.env.NODE_ENV || 'development',
    pid: process.pid
  },
  transports: [
    // Console transport with colors for local development
    new winston.transports.Console({
      format: consoleFormat,
      level: 'debug'
    }),
    
    // File transports
    new winston.transports.File({
      filename: path.join('logs', 'error.log'),
      level: 'error',
      format: fileFormat,
      maxsize: 5242880, // 5MB
      maxFiles: 5
    }),
    
    new winston.transports.File({
      filename: path.join('logs', 'combined.log'),
      format: fileFormat,
      maxsize: 5242880, // 5MB
      maxFiles: 5
    }),
    
    // Separate file for API requests
    new winston.transports.File({
      filename: path.join('logs', 'requests.log'),
      level: 'info',
      format: fileFormat,
      maxsize: 5242880, // 5MB
      maxFiles: 3
    }),
    
    // Database operations log
    new winston.transports.File({
      filename: path.join('logs', 'database.log'),
      level: 'debug',
      format: fileFormat,
      maxsize: 5242880, // 5MB
      maxFiles: 3
    })
  ]
});

// Enhanced logging functions with service context
const createServiceLogger = (serviceName) => {
  return {
    info: (message, meta = {}) => logger.info(message, { ...meta, service: serviceName }),
    error: (message, meta = {}) => logger.error(message, { ...meta, service: serviceName }),
    warn: (message, meta = {}) => logger.warn(message, { ...meta, service: serviceName }),
    debug: (message, meta = {}) => logger.debug(message, { ...meta, service: serviceName }),
    verbose: (message, meta = {}) => logger.verbose(message, { ...meta, service: serviceName })
  };
};

// Request logging middleware
const requestLogger = (serviceName = 'API') => {
  return (req, res, next) => {
    const start = Date.now();
    const serviceLogger = createServiceLogger(serviceName);
    
    // Log incoming request
    serviceLogger.info('Incoming request', {
      method: req.method,
      url: req.url,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      userId: req.user?.id,
      requestId: req.id || Math.random().toString(36).substr(2, 9)
    });
    
    // Log response
    res.on('finish', () => {
      const duration = Date.now() - start;
      const logLevel = res.statusCode >= 400 ? 'error' : 'info';
      
      serviceLogger[logLevel]('Request completed', {
        method: req.method,
        url: req.url,
        status: res.statusCode,
        duration: `${duration}ms`,
        contentLength: res.get('Content-Length'),
        userId: req.user?.id
      });
    });
    
    next();
  };
};

// Database operation logger
const dbLogger = {
  query: (operation, collection, query = {}, duration = 0) => {
    logger.debug('Database operation', {
      service: 'DATABASE',
      operation,
      collection,
      query: JSON.stringify(query),
      duration: `${duration}ms`
    });
  },
  
  connection: (event, details = {}) => {
    logger.info(`Database ${event}`, {
      service: 'DATABASE',
      ...details
    });
  },
  
  error: (operation, error, query = {}) => {
    logger.error('Database error', {
      service: 'DATABASE',
      operation,
      error: error.message,
      stack: error.stack,
      query: JSON.stringify(query)
    });
  }
};

// Kafka operation logger
const kafkaLogger = {
  producer: (topic, message, partition = null) => {
    logger.info('Kafka message produced', {
      service: 'KAFKA',
      topic,
      partition,
      messageSize: JSON.stringify(message).length
    });
  },
  
  consumer: (topic, partition, offset, message) => {
    logger.info('Kafka message consumed', {
      service: 'KAFKA',
      topic,
      partition,
      offset,
      messageSize: JSON.stringify(message).length
    });
  },
  
  error: (operation, error, details = {}) => {
    logger.error('Kafka error', {
      service: 'KAFKA',
      operation,
      error: error.message,
      stack: error.stack,
      ...details
    });
  }
};

// Redis operation logger
const redisLogger = {
  operation: (command, key, duration = 0) => {
    logger.debug('Redis operation', {
      service: 'REDIS',
      command,
      key,
      duration: `${duration}ms`
    });
  },
  
  connection: (event, details = {}) => {
    logger.info(`Redis ${event}`, {
      service: 'REDIS',
      ...details
    });
  },
  
  error: (operation, error, key = null) => {
    logger.error('Redis error', {
      service: 'REDIS',
      operation,
      key,
      error: error.message,
      stack: error.stack
    });
  }
};

// Performance monitoring
const performanceLogger = {
  startTimer: (operation) => {
    const start = process.hrtime.bigint();
    return {
      end: (details = {}) => {
        const end = process.hrtime.bigint();
        const duration = Number(end - start) / 1000000; // Convert to milliseconds
        
        logger.info('Performance metric', {
          service: 'PERFORMANCE',
          operation,
          duration: `${duration.toFixed(2)}ms`,
          ...details
        });
        
        return duration;
      }
    };
  }
};

module.exports = {
  logger,
  createServiceLogger,
  requestLogger,
  dbLogger,
  kafkaLogger,
  redisLogger,
  performanceLogger
};