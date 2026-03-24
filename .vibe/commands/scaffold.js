// .vibe/commands/scaffold.js
const fs = require('fs');
const path = require('path');

module.exports = {
  command: 'scaffold <component>',
  describe: 'Generate boilerplate code for a new component',
  handler: (argv) => {
    const componentName = argv.component;
    const componentDir = path.join(process.cwd(), 'src', componentName);

    if (!fs.existsSync(path.join(process.cwd(), 'src'))) {
      fs.mkdirSync(path.join(process.cwd(), 'src'));
    }

    if (!fs.existsSync(componentDir)) {
      fs.mkdirSync(componentDir, { recursive: true });
      console.log(`Created directory: ${componentDir}`);
    }

    // Create a basic component file using a template
    const templateDir = path.join(__dirname, '../templates');
    const templateFile = path.join(templateDir, 'react-component.js');
    let componentContent = fs.readFileSync(templateFile, 'utf8');
    componentContent = componentContent.replace(/{{componentName}}/g, componentName);
    
    const componentFile = path.join(componentDir, `${componentName}.jsx`);
    fs.writeFileSync(componentFile, componentContent);

    // Create a basic test file
    const testFile = path.join(componentDir, `${componentName}.test.js`);
    fs.writeFileSync(
      testFile,
      `// ${componentName}.test.js
const assert = require('assert');
describe('${componentName}', () => {
  it('should work', () => {
    assert.ok(true);
  });
});
`
    );

    console.log(`Scaffolded ${componentName} successfully.`);
    console.log(`Created files:`);
    console.log(`  - ${path.relative(process.cwd(), componentFile)}`);
    console.log(`  - ${path.relative(process.cwd(), testFile)}`);
    console.log('');
    console.log('💡 Next Steps:');
    console.log('  1. Implement the component logic.');
    console.log('  2. Run `@audit` to check for issues:');
    console.log(`     node test-vibe.js @audit ${path.relative(process.cwd(), componentFile)}`);
    console.log('  3. Generate tests with `@gen-tests`:');
    console.log(`     node test-vibe.js @gen-tests ${path.relative(process.cwd(), componentFile)}`);
  }
};