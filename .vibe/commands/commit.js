// .vibe/commands/commit.js
const { execSync } = require('child_process');

module.exports = {
  command: 'commit',
  describe: 'Generate a conventional commit message',
  handler: () => {
    try {
      // Get the current branch name
      const branch = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8' }).trim();

      // Get the staged changes
      const status = execSync('git diff --cached --name-only', { encoding: 'utf8' }).trim();

      if (!status) {
        console.log('No changes staged for commit.');
        return;
      }

      // Generate a simple conventional commit message
      const type = 'feat'; // Default to feat, can be customized
      const scope = branch.replace('feature/', '').replace('fix/', '');
      const subject = `Add changes for ${scope}`;

      const commitMessage = `${type}(${scope}): ${subject}`;

      console.log('Generated Commit Message:');
      console.log(commitMessage);
      console.log('\nTo commit, run:');
      console.log(`git commit -m "${commitMessage}"`);
      console.log('');
      console.log('💡 Next Steps:');
      console.log('  1. Push your changes:');
      console.log('     git push origin <branch>');
      console.log('  2. Create a pull request for review.');
    } catch (error) {
      console.error('Error:', error.message);
    }
  }
};