// .vibe/skills/code-coverage.js
const fs = require('fs');
const path = require('path');

module.exports = {
  name: 'Code Coverage',
  description: 'Analyzes test coverage',
  execute: (files) => {
    console.log(`Code Coverage: Analyzing files: ${files.join(', ')}`);
    files.forEach(file => {
      const fullPath = path.isAbsolute(file) ? file : path.join(process.cwd(), file);
      if (fs.existsSync(fullPath)) {
        const content = fs.readFileSync(fullPath, 'utf8');
        
        // Check for test files
        if (file.includes('.test.')) {
          console.log(`  ✅ Test file found: ${file}`);
        } else {
          console.log(`  ⚠️  No test file found for ${file}`);
        }
      }
    });
    console.log('Suggested fixes:');
    console.log('- Add tests for all functions.');
    console.log('- Aim for 90% coverage.');
  }
};