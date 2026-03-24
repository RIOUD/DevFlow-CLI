// .vibe/skills/dependency-check.js
const fs = require('fs');
const path = require('path');

module.exports = {
  name: 'Dependency Check',
  description: 'Analyzes dependencies for vulnerabilities',
  execute: () => {
    const packageJsonPath = path.join(process.cwd(), 'package.json');
    if (!fs.existsSync(packageJsonPath)) {
      console.log('⚠️  No package.json found.');
      return;
    }

    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    const dependencies = packageJson.dependencies || {};

    console.log('Dependency Check: Analyzing dependencies...');
    Object.keys(dependencies).forEach(dep => {
      console.log(`  ℹ️  ${dep}@${dependencies[dep]}`);
    });

    console.log('Suggested fixes:');
    console.log('- Pin dependency versions.');
    console.log('- Use npm audit to check for vulnerabilities.');
  }
};