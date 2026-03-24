// .vibe/commands/secure-func.js
const fs = require('fs');
const path = require('path');

module.exports = {
  command: 'secure-func <description>',
  describe: 'Generate a secure function',
  handler: (argv) => {
    const description = argv.description;
    const functionName = description.toLowerCase().replace(/\s+/g, '-');
    const filePath = path.join(process.cwd(), 'src', 'utils', `${functionName}.js`);

    // Create the utils directory if it doesn't exist
    const utilsDir = path.join(process.cwd(), 'src', 'utils');
    if (!fs.existsSync(utilsDir)) {
      fs.mkdirSync(utilsDir, { recursive: true });
    }

    // Generate a secure function template
    const functionContent = `// ${description}
// SOLID Principles: Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion
// Security: Input validation, error handling, logging, no hardcoded secrets

const logger = require('../logger');

/**
 * ${description}
 * @param {Object} params - Input parameters
 * @returns {Promise<Object>} - Result
 * @throws {Error} - If validation fails or operation fails
 */
async function ${functionName}(params) {
  try {
    // Validate input
    if (!params) {
      throw new Error('Invalid input: params is required');
    }

    // Log the operation
    logger.info('Starting ${functionName}', { params });

    // Implement the function logic here
    const result = { success: true };

    // Log the result
    logger.info('Completed ${functionName}', { result });

    return result;
  } catch (error) {
    logger.error('Error in ${functionName}', { error });
    throw error;
  }
}

module.exports = { ${functionName} };
`;

    fs.writeFileSync(filePath, functionContent);
    console.log(`✅ Generated secure function: ${functionName}`);
    console.log(`Created: ${filePath}`);
  }
};