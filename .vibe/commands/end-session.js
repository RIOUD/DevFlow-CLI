// .vibe/commands/end-session.js
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

module.exports = {
  command: 'end-session',
  describe: 'Summarize the work done and suggest next steps',
  handler: () => {
    const sessionLogPath = path.join(process.cwd(), '.vibe', 'session.log');
    const vibeDir = path.join(process.cwd(), '.vibe');

    // Create .vibe directory if it doesn't exist
    if (!fs.existsSync(vibeDir)) {
      fs.mkdirSync(vibeDir, { recursive: true });
    }

    // Get Git status
    let gitStatus = 'No Git repository.';
    try {
      gitStatus = execSync('git status --porcelain', { encoding: 'utf8' }).trim();
    } catch (error) {
      gitStatus = 'No Git repository.';
    }

    // Get staged changes
    let stagedChanges = 'No staged changes.';
    try {
      stagedChanges = execSync('git diff --cached --name-only', { encoding: 'utf8' }).trim();
      if (!stagedChanges) {
        stagedChanges = 'No staged changes.';
      }
    } catch (error) {
      stagedChanges = 'No staged changes.';
    }

    // Get uncommitted changes
    let uncommittedChanges = 'No uncommitted changes.';
    try {
      uncommittedChanges = execSync('git diff --name-only', { encoding: 'utf8' }).trim();
      if (!uncommittedChanges) {
        uncommittedChanges = 'No uncommitted changes.';
      }
    } catch (error) {
      uncommittedChanges = 'No uncommitted changes.';
    }

    // Get current branch
    let branch = 'Unknown';
    try {
      branch = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8' }).trim();
    } catch (error) {
      branch = 'Unknown';
    }

    // Create session summary
    const sessionSummary = `
=== Session Summary ===
Date: ${new Date().toISOString()}
Branch: ${branch}

### Work Done
- Staged Changes: ${stagedChanges}
- Uncommitted Changes: ${uncommittedChanges}
- Git Status: ${gitStatus}

### Next Steps
1. Review the changes above.
2. Commit staged changes:
   git commit -m "<message>"
3. Push changes:
   git push origin ${branch}
4. Start the next session:
   node test-vibe.js start-session

=== End of Session ===
`;

    // Save to session log
    fs.writeFileSync(sessionLogPath, sessionSummary);

    console.log('✅ Session summary saved to .vibe/session.log');
    console.log('');
    console.log('💡 Next Steps:');
    console.log('  1. Review the session summary:');
    console.log('     cat .vibe/session.log');
    console.log('  2. Start the next session:');
    console.log('     node test-vibe.js start-session');
  }
};