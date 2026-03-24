// .vibe/skills/performance-audit.js
const fs = require('fs');
const path = require('path');

module.exports = {
  name: 'Performance Audit',
  description: 'Analyzes code for performance bottlenecks',
  execute: (files) => {
    console.log(`Performance Audit: Analyzing files: ${files.join(', ')}`);
    files.forEach(file => {
      const fullPath = path.isAbsolute(file) ? file : path.join(process.cwd(), file);
      if (fs.existsSync(fullPath)) {
        const content = fs.readFileSync(fullPath, 'utf8');
        
        // Check for time.sleep
        if (content.includes('time.sleep(')) {
          console.log(`  ⚠️  Blocking I/O in ${file}: time.sleep()`);
        }
        
        // Check for synchronous requests
        if (content.includes('requests.get') || content.includes('requests.post')) {
          console.log(`  ⚠️  Synchronous requests in ${file}: requests.get/post()`);
        }
        
        // Check for heavy loops
        if (content.includes('for') || content.includes('while')) {
          console.log(`  ℹ️  Potential heavy loop in ${file}`);
        }
      }
    });
  }
};