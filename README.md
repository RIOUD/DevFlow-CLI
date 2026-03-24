# Vibe CLI Automation

A **proactive, session-aware CLI** for developers. Automates repetitive tasks, enforces best practices, and helps you resume work seamlessly.

## Features

✅ **Proactive Workflow**: Commands suggest next steps.
✅ **Session Management**: `@end-session` and `@start-session` to track progress.
✅ **Automated Agents**: Scaffold, test, audit, and more.
✅ **Extensible**: Add new commands, templates, and skills.
✅ **CI/CD Ready**: Pre-configured for GitHub Actions and GitLab CI.

## Installation

### Option 1: Clone the Repository
```bash
git clone https://github.com/RIOUD/Vibe_cli_Automation.git
cd Vibe_cli_Automation
npm install
```

### Option 2: Use the Setup Script
```bash
./init-vibe-project.sh MyApp
cd MyApp
```

## Usage

### Commands
| Command | Description |
|---------|-------------|
| `@scaffold <name>` | Generate a component |
| `@gen-tests <file>` | Generate tests |
| `@cleanup <file>` | Remove dead code |
| `@secure-func <desc>` | Generate a secure function |
| `@data-model <name>` | Generate a data model |
| `@audit <file>` | Audit code for issues |
| `@commit` | Generate commit message |
| `end-session` | Summarize work done |
| `start-session` | Resume previous session |

### Example Workflow
```bash
# Start a new feature
npm run scaffold UserProfile
npm run data-model User

# Implement logic
npm run secure-func "Fetch user data"

# Audit and test
npm run audit src/UserProfile
npm run gen-tests src/UserProfile/UserProfile.jsx

# Clean up and commit
npm run cleanup src/UserProfile/UserProfile.jsx
git add src/UserProfile/
npm run commit

# End the session
npm run end-session
```

### Session Management
```bash
# End a session
npm run end-session

# Start a new session (resumes previous work)
npm run start-session
```

## Documentation

- [Cheat Sheet](VIBE_CLI_CHEATSHEET.md): Quick reference for all commands.
- [Setup Guide](SETUP_SUMMARY.md): Detailed setup instructions.

## Customization

### Add New Commands
1. Create a new file in `.vibe/commands/` (e.g., `new-command.js`).
2. Define the command:
   ```javascript
   module.exports = {
     command: 'new-command <arg>',
     describe: 'Description of the command',
     handler: (argv) => {
       // Implement logic here
     }
   };
   ```
3. Use the command:
   ```bash
   node test-vibe.js @new-command
   ```

### Add New Templates
1. Create a new template in `.vibe/templates/` (e.g., `new-template.js`).
2. Use placeholders like `{{name}}` for dynamic content.
3. Update the `scaffold` command to use the new template.

### Add New Agents
1. Create a new agent in `.vibe/agents/` (e.g., `new-agent.js`).
2. Define the agent’s workflow and commands.
3. Use the agent:
   ```javascript
   const agent = require('./.vibe/agents/new-agent');
   agent.execute('args');
   ```

## CI/CD Integration

### GitHub Actions
```yaml
name: Vibe CLI Audit
on: [push, pull_request]

jobs:
  audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm install
      - run: node test-vibe.js @audit src/
```

### GitLab CI
```yaml
stages:
  - audit

audit:
  stage: audit
  script:
    - npm install
    - node test-vibe.js @audit src/
```

## License

MIT
