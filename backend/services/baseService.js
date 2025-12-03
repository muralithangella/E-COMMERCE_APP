const DatabaseManager = require('../config/database');
const KafkaManager = require('../config/kafka');
const { logger } = require('../utils/logger');

class BaseService {
  constructor(serviceName) {
    this.serviceName = serviceName;
  }

  getMongoConnection(dbName = 'main') {
    return DatabaseManager.getMongoConnection(dbName);
  }

  getRedisClient() {
    return DatabaseManager.getRedisClient();
  }

  async publishEvent(topic, eventType, data) {
    try {
      await KafkaManager.publishEvent(topic, {
        eventType,
        data,
        service: this.serviceName,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      logger.error(`Failed to publish event ${eventType}:`, error);
    }
  }

  logInfo(message, meta = {}) {
    logger.info(message, { service: this.serviceName, ...meta });
  }

  logError(message, error, meta = {}) {
    logger.error(message, { service: this.serviceName, error: error.message, stack: error.stack, ...meta });
  }

  async withTransaction(callback) {
    const session = await this.getMongoConnection().startSession();
    try {
      return await session.withTransaction(callback);
    } finally {
      await session.endSession();
    }
  }
}

module.exports = BaseService;