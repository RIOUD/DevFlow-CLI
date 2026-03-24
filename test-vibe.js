// test-vibe.js
const fs = require('fs');
const path = require('path');

// Load commands from .vibe/commands
const commandsDir = path.join(__dirname, '.vibe', 'commands');
const commandFiles = fs.readdirSync(commandsDir);

const commands = {};
commandFiles.forEach(file => {
  if (file.endsWith('.js')) {
    const command = require(path.join(commandsDir, file));
    // Store command by its base name (e.g., 'scaffold' from 'scaffold <component>')
    const commandName = command.command.split(' ')[0];
    commands[commandName] = command;
  }
});

// Parse arguments
const args = process.argv.slice(2);
let commandName = args[0];
const commandArgs = args.slice(1);

// Support @ or / prefixes (e.g., @commit, /audit)
if (commandName && (commandName.startsWith('@') || commandName.startsWith('/'))) {
  commandName = commandName.substring(1); // Remove @ or /
}

if (commands[commandName]) {
  const command = commands[commandName];
  const argv = { _: commandArgs };
  
  // Map command arguments to their names (e.g., <component> in 'scaffold <component>')
  const commandParts = command.command.split(' ');
  commandArgs.forEach((arg, index) => {
    if (commandParts.length > index + 1) {
      const part = commandParts[index + 1];
      if (part.startsWith('<') && part.endsWith('>')) {
        const paramName = part.slice(1, -1);
        argv[paramName] = arg;
      }
    }
  });
  
  command.handler(argv);
} else {
  console.log('Available commands:');
  Object.keys(commands).forEach(cmd => {
    console.log(`  @${cmd} or /${cmd} - ${commands[cmd].describe}`);
  });
}