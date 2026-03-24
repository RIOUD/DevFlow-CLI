// .vibe/skills/security-audit.js
const fs = require('fs');
const path = require('path');

module.exports = {
  name: 'Security Audit',
  description: 'Analyzes code for security vulnerabilities',
  execute: (files) => {
    console.log(`Security Audit: Analyzing files: ${files.join(', ')}`);
    files.forEach(file => {
      const fullPath = path.isAbsolute(file) ? file : path.join(process.cwd(), file);
      if (fs.existsSync(fullPath)) {
        const content = fs.readFileSync(fullPath, 'utf8');
        if (content.includes('password') || content.includes('secret')) {
          console.log(`  ⚠️  Potential hardcoded secrets in ${file}`);
        }
        if (content.includes('TODO')) {
          console.log(`  📝  TODO found in ${file}`);
        }
      }
    });
  }
};