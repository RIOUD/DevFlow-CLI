// Service Template
// SOLID Principles: Single Responsibility, Dependency Injection
// Security: Input validation, error handling, logging

const logger = require('../logger');

class {{serviceName}}Service {
  /**
   * Create a new {{serviceName}}Service instance
   * @param {Object} dependencies - Injected dependencies
   */
  constructor(dependencies) {
    this.dependencies = dependencies;
    this.logger = logger;
  }

  /**
   * Example method
   * @param {Object} params - Input parameters
   * @returns {Promise<Object>} - Result
   */
  async exampleMethod(params) {
    try {
      this.logger.info('Starting exampleMethod', { params });
      // Implement logic here
      const result = { success: true };
      this.logger.info('Completed exampleMethod', { result });
      return result;
    } catch (error) {
      this.logger.error('Error in exampleMethod', { error });
      throw error;
    }
  }
}

module.exports = { {{serviceName}}Service };