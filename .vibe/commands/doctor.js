// .vibe/commands/doctor.js
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

function parseMajorVersion(version) {
  const clean = String(version || '').replace(/^v/, '');
  const major = Number.parseInt(clean.split('.')[0], 10);
  return Number.isNaN(major) ? null : major;
}

function addResult(results, status, title, detail) {
  results.push({ status, title, detail });
}

function runCommand(command, args = []) {
  return execFileSync(command, args, { encoding: 'utf8' }).trim();
}

module.exports = {
  command: 'doctor',
  describe: 'Run environment and project readiness checks',
  handler: () => {
    const cwd = process.cwd();
    const vibeDir = path.join(cwd, '.vibe');
    const commandsDir = path.join(vibeDir, 'commands');
    const vibercPath = path.join(cwd, '.viberc');
    const packageJsonPath = path.join(cwd, 'package.json');
    const results = [];

    const nodeMajor = parseMajorVersion(process.version);
    if (nodeMajor === null) {
      addResult(results, 'warn', 'Node.js version', `Unable to parse Node version (${process.version}).`);
    } else if (nodeMajor >= 18) {
      addResult(results, 'pass', 'Node.js version', `${process.version} is suitable.`);
    } else {
      addResult(results, 'warn', 'Node.js version', `${process.version} detected. Recommended version is v18+.`);
    }

    try {
      const npmVersion = runCommand('npm', ['--version']);
      addResult(results, 'pass', 'npm availability', `npm ${npmVersion} detected.`);
    } catch (error) {
      addResult(results, 'fail', 'npm availability', 'npm is not available in PATH.');
    }

    try {
      const gitVersion = runCommand('git', ['--version']);
      addResult(results, 'pass', 'Git availability', `${gitVersion} detected.`);
    } catch (error) {
      addResult(results, 'fail', 'Git availability', 'Git is not available in PATH.');
    }

    try {
      const isGitRepo = runCommand('git', ['rev-parse', '--is-inside-work-tree']);
      if (isGitRepo === 'true') {
        addResult(results, 'pass', 'Repository check', 'Current directory is inside a Git work tree.');
      } else {
        addResult(results, 'warn', 'Repository check', 'Current directory is not inside a Git work tree.');
      }
    } catch (error) {
      addResult(results, 'warn', 'Repository check', 'Current directory is not inside a Git work tree.');
    }

    if (fs.existsSync(packageJsonPath)) {
      addResult(results, 'pass', 'Project manifest', 'package.json found.');
    } else {
      addResult(results, 'warn', 'Project manifest', 'package.json not found in current directory.');
    }

    if (fs.existsSync(vibeDir)) {
      addResult(results, 'pass', '.vibe directory', '.vibe directory found.');
    } else {
      addResult(results, 'warn', '.vibe directory', '.vibe directory not found. Local commands may be unavailable.');
    }

    if (fs.existsSync(commandsDir)) {
      const jsCommands = fs.readdirSync(commandsDir).filter(file => file.endsWith('.js'));
      if (jsCommands.length > 0) {
        addResult(results, 'pass', 'Command files', `${jsCommands.length} command file(s) detected.`);
      } else {
        addResult(results, 'warn', 'Command files', 'No command files found in .vibe/commands.');
      }
    } else {
      addResult(results, 'warn', 'Command files', '.vibe/commands directory not found.');
    }

    if (fs.existsSync(vibercPath)) {
      try {
        const viberc = require(vibercPath);
        if (viberc && typeof viberc.commands === 'string') {
          const resolvedCommands = viberc.commands;
          if (fs.existsSync(resolvedCommands)) {
            addResult(results, 'pass', '.viberc commands path', `Resolved commands path exists: ${resolvedCommands}`);
          } else {
            addResult(results, 'warn', '.viberc commands path', `Configured commands path not found: ${resolvedCommands}`);
          }
        } else {
          addResult(results, 'warn', '.viberc commands path', 'No valid "commands" path was found in .viberc.');
        }
      } catch (error) {
        addResult(results, 'warn', '.viberc configuration', `Unable to load .viberc (${error.message}).`);
      }
    } else {
      addResult(results, 'warn', '.viberc configuration', '.viberc not found in current directory.');
    }

    try {
      fs.accessSync(cwd, fs.constants.W_OK);
      addResult(results, 'pass', 'Workspace permissions', 'Current directory is writable.');
    } catch (error) {
      addResult(results, 'fail', 'Workspace permissions', 'Current directory is not writable.');
    }

    if (fs.existsSync(vibeDir)) {
      const probeFile = path.join(vibeDir, '.doctor-write-check.tmp');
      try {
        fs.writeFileSync(probeFile, 'ok');
        fs.unlinkSync(probeFile);
        addResult(results, 'pass', '.vibe write check', '.vibe is writable.');
      } catch (error) {
        addResult(results, 'warn', '.vibe write check', `Unable to write to .vibe (${error.message}).`);
      }
    }

    const statusIcon = {
      pass: '✅',
      warn: '⚠️',
      fail: '❌'
    };

    console.log('=== Vibe Doctor Report ===');
    console.log(`Path: ${cwd}`);
    console.log('');

    results.forEach(result => {
      console.log(`${statusIcon[result.status]} ${result.title}: ${result.detail}`);
    });

    const failCount = results.filter(result => result.status === 'fail').length;
    const warnCount = results.filter(result => result.status === 'warn').length;

    console.log('');
    if (failCount > 0) {
      console.log(`Result: ${failCount} critical issue(s), ${warnCount} warning(s).`);
      console.log('Fix critical issues first, then rerun `vibe @doctor`.');
      process.exitCode = 1;
      return;
    }

    if (warnCount > 0) {
      console.log(`Result: no critical issues, ${warnCount} warning(s).`);
      console.log('Recommended next step: address warnings and rerun `vibe @doctor`.');
      return;
    }

    console.log('Result: all checks passed. Your Vibe setup is healthy.');
    console.log('Suggested flow: `vibe @audit <file>` -> `vibe @gen-tests <file>` -> `vibe @commit`.');
  }
};
