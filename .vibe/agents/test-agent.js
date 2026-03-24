// .vibe/agents/test-agent.js
const genTests = require('../commands/gen-tests');
const audit = require('../commands/audit');

module.exports = {
  name: 'Test Agent',
  description: 'Automates test generation and auditing',
  commands: ['gen-tests', 'audit'],
  workflow: [
    { step: 1, action: 'Generate tests' },
    { step: 2, action: 'Audit the tests' },
    { step: 3, action: 'Confirm completion' }
  ],
  execute: (filePath) => {
    console.log(`Test Agent: Generating and auditing tests for ${filePath}...`);
    
    // Step 1: Generate tests
    genTests.handler({ file: filePath });
    
    // Step 2: Audit the tests
    const testFile = filePath.replace(/\.js$/, '.test.js');
    if (fs.existsSync(testFile)) {
      audit.handler({ file: testFile });
    }
    
    console.log(`Test Agent: Tests generated and audited for ${filePath}.`);
  }
};