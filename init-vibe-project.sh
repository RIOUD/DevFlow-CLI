#!/bin/bash
# init-vibe-project.sh
# Automatically sets up a new project with Vibe CLI rules and workflow.

if [ -z "$1" ]; then
  echo "Usage: $0 <project-name>"
  exit 1
fi

# Validate project name (no special characters)
if [[ ! "$1" =~ ^[a-zA-Z0-9_-]+$ ]]; then
  echo "Error: Project name can only contain letters, numbers, underscores, and hyphens."
  exit 1
fi

PROJECT_NAME=$1
PROJECT_DIR="./$PROJECT_NAME"

# Check for Node.js
if ! command -v node &> /dev/null; then
  echo "Error: Node.js is not installed. Please install Node.js first."
  exit 1
fi

# Check for Git
if ! command -v git &> /dev/null; then
  echo "Error: Git is not installed. Please install Git first."
  exit 1
fi

# Create the project directory
echo "📁 Creating project directory: $PROJECT_DIR"
mkdir -p "$PROJECT_DIR"
cd "$PROJECT_DIR" || exit 1

# Copy the Vibe CLI template from the original location
echo "📦 Copying Vibe CLI template..."
VIBE_CLI_SOURCE="/home/ricky/Documenten/Obsidian Vault/Projects/Vibe CLI"
cp -r "$VIBE_CLI_SOURCE/.vibe" .
cp "$VIBE_CLI_SOURCE/.viberc" .
cp "$VIBE_CLI_SOURCE/test-vibe.js" .

# Initialize npm and install dependencies
echo "📦 Initializing npm and installing dependencies..."
npm init -y
npm install yargs

# Create a standard .gitignore
echo "📝 Creating .gitignore..."
cat > .gitignore << 'EOF'
node_modules/
.DS_Store
.env
*.log
EOF

# Initialize Git
echo "🔧 Initializing Git..."
git init

# Create a project README
echo "📝 Creating project README..."
cat > README.md << 'EOF'
# $PROJECT_NAME

## Project Setup

This project uses Vibe CLI for automated scaffolding, auditing, and committing.

### Available Commands

- Scaffold a component:
  node test-vibe.js @scaffold <componentName>

- Audit a file:
  node test-vibe.js @audit <filePath>

- Generate commit message:
  node test-vibe.js @commit

### Workflow

1. Scaffold: Start with @scaffold to generate boilerplate code.
2. Implement: Write secure, SOLID code.
3. Audit: Use @audit to check for issues.
4. Test: Write and run tests.
5. Commit: Use @commit to generate conventional commit messages.

### Rules

- SOLID Principles: Keep functions small and single-purpose.
- Security First: Always audit code before committing.
- Conventional Commits: Follow type(scope): subject format.
- DRY (Don't Repeat Yourself): Reuse templates and agents.

---

## Getting Started

1. Scaffold a new component:
   node test-vibe.js @scaffold UserProfile

2. Audit the component:
   node test-vibe.js @audit src/UserProfile/UserProfile.jsx

3. Commit changes:
   git add src/UserProfile/
   node test-vibe.js @commit
   git commit -m "feat(profile): add user profile page"

---

## Customization

- Add new commands: Place new command files in .vibe/commands/.
- Add new templates: Place new template files in .vibe/templates/.
- Add new agents: Place new agent files in .vibe/agents/.
- Add new skills: Place new skill files in .vibe/skills/.

---

## License

MIT
EOF

# Create a package.json with standard scripts
echo "📝 Updating package.json with standard scripts..."
cat > package.json << EOF
{
  "name": "$PROJECT_NAME",
  "version": "1.0.0",
  "description": "A project set up with Vibe CLI",
  "main": "index.js",
  "scripts": {
    "start": "echo \"Start your app here\"",
    "test": "echo \"Run tests here\"",
    "lint": "echo \"Run linter here\"",
    "build": "echo \"Build your app here\"",
    "scaffold": "node test-vibe.js @scaffold",
    "gen-tests": "node test-vibe.js @gen-tests",
    "cleanup": "node test-vibe.js @cleanup",
    "secure-func": "node test-vibe.js @secure-func",
    "data-model": "node test-vibe.js @data-model",
    "audit": "node test-vibe.js @audit",
    "commit": "node test-vibe.js @commit",
    "end-session": "node test-vibe.js end-session",
    "start-session": "node test-vibe.js start-session"
  },
  "keywords": [],
  "author": "",
  "license": "MIT",
  "dependencies": {
    "yargs": "^17.7.2"
  }
}
EOF

# Create a cheat sheet for quick reference
echo "📝 Creating Vibe CLI cheat sheet..."
cp "$VIBE_CLI_SOURCE/VIBE_CLI_CHEATSHEET.md" .

# Create a setup summary
echo "📝 Creating setup summary..."
cat > SETUP_SUMMARY.md << 'EOF'
# Setup Summary for $PROJECT_NAME

## What Was Set Up

1. Vibe CLI Template: Copied from Projects/Vibe CLI.
2. Dependencies: Installed yargs for command-line parsing.
3. Git: Initialized with a standard .gitignore.
4. Commands: Configured @scaffold, @audit, and @commit.
5. Scripts: Added npm scripts for easy access to Vibe CLI commands.

## How to Use

### Scaffold a Component
npm run scaffold UserProfile
or
node test-vibe.js @scaffold UserProfile

### Audit a File
npm run audit src/UserProfile/UserProfile.jsx
or
node test-vibe.js @audit src/UserProfile/UserProfile.jsx

### Commit Changes
git add src/UserProfile/
npm run commit
or
node test-vibe.js @commit

## Next Steps

1. Start coding with:
   npm run scaffold <componentName>

2. Audit your code with:
   npm run audit <filePath>

3. Commit your changes with:
   npm run commit

## Customization

- Add new commands: Place new command files in .vibe/commands/.
- Add new templates: Place new template files in .vibe/templates/.
- Add new agents: Place new agent files in .vibe/agents/.
- Add new skills: Place new skill files in .vibe/skills/.

## Rules Enforced

1. SOLID Principles: Functions are small, single-purpose, and testable.
2. Security First: Code is audited for vulnerabilities before committing.
3. Conventional Commits: Commit messages follow type(scope): subject format.
4. DRY (Don't Repeat Yourself): Templates and agents are reused.
5. KISS (Keep It Simple): Avoid over-engineering; focus on clarity.

---

## License

MIT
EOF

echo "✅ Project '$PROJECT_NAME' is ready!"
echo ""
echo "Next steps:"
echo "  1. cd $PROJECT_DIR"
echo "  2. npm run scaffold <componentName>"
echo "  3. Start coding!"
echo ""
echo "Refer to VIBE_CLI_CHEATSHEET.md for a quick reference."