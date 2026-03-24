// .vibe/commands/audit.js
const fs = require('fs');
const path = require('path');

module.exports = {
  command: 'audit <file>',
  describe: 'Analyze a file for basic issues',
  handler: (argv) => {
    const filePath = argv.file;
    const fullPath = path.isAbsolute(filePath) ? filePath : path.join(process.cwd(), filePath);

    if (!fs.existsSync(fullPath)) {
      console.error(`Error: File not found - ${fullPath}`);
      process.exit(1);
    }

    const content = fs.readFileSync(fullPath, 'utf8');

    // Basic checks
    const issues = [];

    // Check for console.log
    if (content.includes('console.log')) {
      issues.push('Found console.log statements. Consider using a logger.');
    }

    // Check for hardcoded secrets (simple check)
    if (content.includes('password') || content.includes('secret')) {
      issues.push('Potential hardcoded secrets found. Review for security.');
    }

    // Check for TODO comments
    if (content.includes('TODO')) {
      issues.push('Found TODO comments. Address them before production.');
    }

    if (issues.length === 0) {
      console.log('No issues found.');
    } else {
      console.log('Issues found:');
      issues.forEach((issue, index) => {
        console.log(`  ${index + 1}. ${issue}`);
      });
    }
    console.log('');
    console.log('💡 Next Steps:');
    if (issues.length > 0) {
      console.log('  1. Fix the issues listed above.');
      console.log('  2. Run `@cleanup` to remove dead code:');
      console.log(`     node test-vibe.js @cleanup ${filePath}`);
    }
    console.log('  3. Generate tests if not already done:');
    console.log(`     node test-vibe.js @gen-tests ${filePath}`);
    console.log('  4. Commit your changes:');
    console.log('     git add <files>');
    console.log('     node test-vibe.js @commit');
  }
};