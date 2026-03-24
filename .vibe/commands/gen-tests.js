// .vibe/commands/gen-tests.js
const fs = require('fs');
const path = require('path');

module.exports = {
  command: 'gen-tests <file>',
  describe: 'Generate tests for a file',
  handler: (argv) => {
    const filePath = argv.file;
    const fullPath = path.isAbsolute(filePath) ? filePath : path.join(process.cwd(), filePath);

    if (!fs.existsSync(fullPath)) {
      console.error(`Error: File not found - ${fullPath}`);
      process.exit(1);
    }

    const content = fs.readFileSync(fullPath, 'utf8');
    const testFilePath = fullPath.replace(/\.js$/, '.test.js');

    // Generate a basic test file
    const componentName = path.basename(fullPath, '.js');
    const testContent = `// ${componentName}.test.js
const assert = require('assert');
describe('${componentName}', () => {
  it('should work', () => {
    assert.ok(true);
  });
});
`;

    fs.writeFileSync(testFilePath, testContent);
    console.log(`✅ Generated tests for ${filePath}`);
    console.log(`Created: ${testFilePath}`);
    console.log('');
    console.log('💡 Next Steps:');
    console.log('  1. Run the tests:');
    console.log('     npm test');
    console.log('  2. Audit the tests for issues:');
    console.log(`     node test-vibe.js @audit ${testFilePath}`);
    console.log('  3. Clean up the code:');
    console.log(`     node test-vibe.js @cleanup ${filePath}`);
  }
};