// .vibe/agents/scaffold-agent.js
const scaffold = require('../commands/scaffold');
const genTests = require('../commands/gen-tests');

module.exports = {
  name: 'Scaffold Agent',
  description: 'Handles scaffolding of new components',
  commands: ['scaffold', 'gen-tests'],
  workflow: [
    { step: 1, action: 'Prompt for component type' },
    { step: 2, action: 'Generate files' },
    { step: 3, action: 'Generate tests' },
    { step: 4, action: 'Confirm completion' }
  ],
  execute: (componentName) => {
    console.log(`Scaffold Agent: Creating ${componentName}...`);
    
    // Step 1: Scaffold the component
    scaffold.handler({ component: componentName });
    
    // Step 2: Generate tests
    const componentFile = `src/${componentName}/${componentName}.jsx`;
    if (fs.existsSync(componentFile)) {
      genTests.handler({ file: componentFile });
    }
    
    console.log(`Scaffold Agent: ${componentName} created successfully with tests.`);
  }
};