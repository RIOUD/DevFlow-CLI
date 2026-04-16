// test-vibe.js
const fs = require('fs');
const path = require('path');

function isPathInside(parentPath, childPath) {
  const parent = path.resolve(parentPath);
  const child = path.resolve(childPath);
  return child === parent || child.startsWith(`${parent}${path.sep}`);
}

function getCommandsDirFromViberc(projectRoot) {
  const vibercPath = path.resolve(projectRoot, '.viberc');
  if (!isPathInside(projectRoot, vibercPath)) {
    return null;
  }

  if (!fs.existsSync(vibercPath)) {
    return null;
  }

  try {
    const config = require(vibercPath);
    if (config && typeof config.commands === 'string' && fs.existsSync(config.commands)) {
      return config.commands;
    }
  } catch (error) {
    console.warn(`Warning: Failed to read .viberc (${error.message})`);
  }

  return null;
}

function resolveCommandsDir() {
  const projectRoot = process.cwd();
  const vibercDir = getCommandsDirFromViberc(projectRoot);
  if (vibercDir) {
    return vibercDir;
  }

  const localDir = path.join(projectRoot, '.vibe', 'commands');
  if (fs.existsSync(localDir)) {
    return localDir;
  }

  return path.join(__dirname, '.vibe', 'commands');
}

const commandsDir = resolveCommandsDir();
if (!fs.existsSync(commandsDir)) {
  console.error(`Error: Commands directory not found - ${commandsDir}`);
  process.exit(1);
}

function getCommandFiles() {
  return fs.readdirSync(commandsDir).filter(file => file.endsWith('.js'));
}

function normalizeCommandName(commandName) {
  if (!commandName) {
    return '';
  }
  if (commandName.startsWith('@') || commandName.startsWith('/')) {
    return commandName.substring(1);
  }
  return commandName;
}

function loadCommandFromFile(fileName) {
  const commandPath = path.resolve(commandsDir, fileName);
  if (!isPathInside(commandsDir, commandPath) || !fs.existsSync(commandPath)) {
    return null;
  }

  const command = require(commandPath);
  if (!command || typeof command.command !== 'string' || typeof command.handler !== 'function') {
    return null;
  }

  return command;
}

function loadAllCommands() {
  const commands = {};
  getCommandFiles().forEach(file => {
    const command = loadCommandFromFile(file);
    if (!command) {
      return;
    }

    const commandName = command.command.split(' ')[0];
    commands[commandName] = command;
  });
  return commands;
}

function getCommandNames() {
  const fileBasedNames = getCommandFiles().map(file => file.replace(/\.js$/, ''));
  const declaredNames = Object.keys(loadAllCommands());
  return [...new Set([...fileBasedNames, ...declaredNames])].sort();
}

function listCommands() {
  const commands = loadAllCommands();
  console.log('Available commands:');
  Object.keys(commands)
    .sort()
    .forEach(cmd => {
      console.log(`  @${cmd} or /${cmd} - ${commands[cmd].describe}`);
    });
}

function getClosestCommand(input, commandNames) {
  if (!input || commandNames.length === 0) {
    return null;
  }

  const lowerInput = input.toLowerCase();
  const startsWith = commandNames.find(name => name.toLowerCase().startsWith(lowerInput));
  if (startsWith) {
    return startsWith;
  }

  const includes = commandNames.find(name => name.toLowerCase().includes(lowerInput));
  if (includes) {
    return includes;
  }

  const getDistance = (a, b) => {
    const rows = a.length + 1;
    const cols = b.length + 1;
    const matrix = Array.from({ length: rows }, () => Array(cols).fill(0));

    for (let i = 0; i < rows; i += 1) {
      matrix[i][0] = i;
    }
    for (let j = 0; j < cols; j += 1) {
      matrix[0][j] = j;
    }

    for (let i = 1; i < rows; i += 1) {
      for (let j = 1; j < cols; j += 1) {
        const cost = a[i - 1] === b[j - 1] ? 0 : 1;
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j - 1] + cost
        );
      }
    }

    return matrix[rows - 1][cols - 1];
  };

  let bestMatch = null;
  let bestDistance = Number.POSITIVE_INFINITY;

  commandNames.forEach(name => {
    const distance = getDistance(lowerInput, name.toLowerCase());
    if (distance < bestDistance) {
      bestDistance = distance;
      bestMatch = name;
    }
  });

  return bestDistance <= 3 ? bestMatch : null;
}

function getRequiredParams(commandDefinition) {
  return commandDefinition
    .split(' ')
    .filter(part => part.startsWith('<') && part.endsWith('>'))
    .map(part => part.slice(1, -1));
}

function showCommandUsage(commandName, command) {
  console.error(`Error: Missing required arguments for "${commandName}".`);
  console.log(`Usage: vibe @${command.command}`);
}

function loadRequestedCommand(commandName) {
  const directFile = `${commandName}.js`;
  let command = loadCommandFromFile(directFile);
  if (command) {
    return command;
  }

  // Fallback for command files whose names differ from declared command names.
  const commands = loadAllCommands();
  return commands[commandName] || null;
}

// Parse arguments
const args = process.argv.slice(2);
const firstArg = args[0];
const commandArgs = args.slice(1);
const commandName = normalizeCommandName(firstArg);

if (!firstArg || firstArg === '--help' || firstArg === '-h' || commandName === 'help') {
  listCommands();
  process.exit(0);
}

const command = loadRequestedCommand(commandName);
if (!command) {
  const commandNames = getCommandNames();
  const suggestion = getClosestCommand(commandName, commandNames);
  console.error(`Error: Unknown command "${commandName}".`);
  if (suggestion) {
    console.log(`Did you mean "@${suggestion}"?`);
  }
  console.log('');
  listCommands();
  process.exit(1);
}

const requiredParams = getRequiredParams(command.command);
if (commandArgs.length < requiredParams.length) {
  showCommandUsage(commandName, command);
  process.exit(1);
}

const argv = { _: commandArgs };
requiredParams.forEach((paramName, index) => {
  argv[paramName] = commandArgs[index];
});

command.handler(argv);