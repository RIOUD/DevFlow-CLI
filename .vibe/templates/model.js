// Model Template
// SOLID Principles: Single Responsibility
// Security: Input validation, no PII exposure

class {{modelName}} {
  /**
   * Create a new {{modelName}} instance
   * @param {Object} data - Input data
   */
  constructor(data) {
    this.validate(data);
    this.data = data;
  }

  /**
   * Validate input data
   * @param {Object} data - Input data
   * @throws {Error} - If validation fails
   */
  validate(data) {
    if (!data) {
      throw new Error('Invalid input: data is required');
    }
    // Add validation logic here
  }

  /**
   * Get the model data
   * @returns {Object} - Model data
   */
  toJSON() {
    return this.data;
  }
}

module.exports = { {{modelName}} };