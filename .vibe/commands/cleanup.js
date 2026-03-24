// .vibe/commands/cleanup.js
const fs = require('fs');
const path = require('path');

module.exports = {
  command: 'cleanup <file>',
  describe: 'Remove dead code and refactor',
  handler: (argv) => {
    const filePath = argv.file;
    const fullPath = path.isAbsolute(filePath) ? filePath : path.join(process.cwd(), filePath);

    if (!fs.existsSync(fullPath)) {
      console.error(`Error: File not found - ${fullPath}`);
      process.exit(1);
    }

    let content = fs.readFileSync(fullPath, 'utf8');
    const originalContent = content;

    // Remove unused imports (simple check for unused variables)
    content = content.replace(/const\s+\w+\s*=\s*require\([^)]+\);\n/g, '');

    // Remove console.log statements
    content = content.replace(/console\.log\([^)]*\);\n/g, '');

    // Remove TODO comments
    content = content.replace(/\/\/\s*TODO.*\n/g, '');

    if (content !== originalContent) {
      fs.writeFileSync(fullPath, content);
      console.log(`✅ Cleaned up ${filePath}`);
    } else {
      console.log(`✅ No cleanup needed for ${filePath}`);
    }
    console.log('');
    console.log('💡 Next Steps:');
    console.log('  1. Run `@audit` to check for remaining issues:');
    console.log(`     node test-vibe.js @audit ${filePath}`);
    console.log('  2. Commit your changes:');
    console.log('     git add <files>');
    console.log('     node test-vibe.js @commit');
  }
};