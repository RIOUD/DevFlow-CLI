#!/bin/bash
# setup-new-project.sh

if [ -z "$1" ]; then
  echo "Usage: $0 <project-name>"
  exit 1
fi

PROJECT_NAME=$1

# Create the project directory
mkdir -p "$PROJECT_NAME"
cd "$PROJECT_NAME"

# Copy the .vibe directory and .viberc file
cp -r ../.vibe .
cp ../.viberc .

# Initialize npm and install dependencies
npm init -y
npm install yargs

# Create a test script
cat > test-vibe.js << 'EOF'
// test-vibe.js
const fs = require('fs');
const path = require('path');

// Load commands from .vibe/commands
const commandsDir = './.vibe/commands';
const commandFiles = fs.readdirSync(commandsDir);

const commands = {};
commandFiles.forEach(file => {
  if (file.endsWith('.js')) {
    const command = require(path.join(commandsDir, file));
    commands[command.command.split(' ')[0]] = command;
  }
});

// Parse arguments
const args = process.argv.slice(2);
const commandName = args[0];
const commandArgs = args.slice(1);

if (commands[commandName]) {
  const command = commands[commandName];
  const argv = { _: commandArgs };
  commandArgs.forEach((arg, index) => {
    const parts = command.command.split(' ');
    if (parts.length > 1 && parts[1].startsWith('<') && parts[1].endsWith('>')) {
      const paramName = parts[1].slice(1, -1);
      argv[paramName] = arg;
    }
  });
  command.handler(argv);
} else {
  console.log('Available commands:');
  Object.keys(commands).forEach(cmd => {
    console.log(`  ${cmd} - ${commands[cmd].describe}`);
  });
}
EOF

echo "Project $PROJECT_NAME initialized with Vibe CLI template."
echo "You can now use the following commands:"
echo "  node test-vibe.js scaffold <componentName>"
echo "  node test-vibe.js audit <filePath>"
echo "  node test-vibe.js commit"
