// .vibe/commands/start-session.js
const fs = require('fs');
const path = require('path');

module.exports = {
  command: 'start-session',
  describe: 'Resume the previous session and suggest next steps',
  handler: () => {
    const sessionLogPath = path.join(process.cwd(), '.vibe', 'session.log');

    // Check if session log exists
    if (!fs.existsSync(sessionLogPath)) {
      console.log('⚠️  No previous session found.');
      console.log('');
      console.log('💡 Suggested First Steps:');
      console.log('  1. Scaffold a new component:');
      console.log('     node test-vibe.js @scaffold <componentName>');
      console.log('  2. Or implement a new feature:');
      console.log('     node test-vibe.js @secure-func <description>');
      return;
    }

    // Read the session log
    const sessionLog = fs.readFileSync(sessionLogPath, 'utf8');

    console.log('=== Resuming Previous Session ===');
    console.log(sessionLog);
    console.log('');
    console.log('💡 Next Steps:');
    console.log('  1. Review the changes listed above.');
    console.log('  2. Commit staged changes:');
    console.log('     git commit -m "<message>"');
    console.log('  3. Push changes:');
    console.log('     git push origin <branch>');
    console.log('  4. Continue working on the feature.');
  }
};