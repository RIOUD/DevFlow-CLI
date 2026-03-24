// .vibe/commands/data-model.js
const fs = require('fs');
const path = require('path');

module.exports = {
  command: 'data-model <name>',
  describe: 'Generate a data model',
  handler: (argv) => {
    const name = argv.name;
    const filePath = path.join(process.cwd(), 'src', 'models', `${name}.js`);

    // Create the models directory if it doesn't exist
    const modelsDir = path.join(process.cwd(), 'src', 'models');
    if (!fs.existsSync(modelsDir)) {
      fs.mkdirSync(modelsDir, { recursive: true });
    }

    // Generate a data model template
    const modelContent = `// ${name}.js
// Data Model: ${name}
// SOLID Principles: Single Responsibility, Open/Closed
// Security: Input validation, no PII exposure

class ${name} {
  /**
   * Create a new ${name} instance
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

module.exports = { ${name} };
`;

    fs.writeFileSync(filePath, modelContent);
    console.log(`✅ Generated data model: ${name}`);
    console.log(`Created: ${filePath}`);
  }
};