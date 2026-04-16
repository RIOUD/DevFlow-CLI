const test = require('node:test');
const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const path = require('node:path');
const fs = require('node:fs');

const projectRoot = path.resolve(__dirname, '..');
const cliEntry = path.join(projectRoot, 'test-vibe.js');

function runCli(args) {
  const result = spawnSync(process.execPath, [cliEntry, ...args], {
    cwd: projectRoot,
    encoding: 'utf8'
  });

  return {
    status: result.status,
    stdout: result.stdout || '',
    stderr: result.stderr || ''
  };
}

test('help output lists doctor command', () => {
  const result = runCli(['--help']);

  assert.equal(result.status, 0);
  assert.match(result.stdout, /@doctor or \/doctor - Run environment and project readiness checks/);
});

test('unknown command suggests closest match', () => {
  const result = runCli(['@scafold']);

  assert.equal(result.status, 1);
  assert.match(result.stderr, /Unknown command "scafold"/);
  assert.match(result.stdout, /Did you mean "@scaffold"\?/);
});

test('missing required argument shows usage guidance', () => {
  const result = runCli(['@scaffold']);

  assert.equal(result.status, 1);
  assert.match(result.stderr, /Missing required arguments for "scaffold"/);
  assert.match(result.stdout, /Usage: vibe @scaffold <component>/);
});

test('doctor command completes successfully', () => {
  const result = runCli(['@doctor']);

  assert.equal(result.status, 0);
  assert.match(result.stdout, /=== Vibe Doctor Report ===/);
});

test('audit reports OWASP findings for insecure sample', () => {
  const tmpDir = fs.mkdtempSync(path.join(projectRoot, '.tmp-vibe-audit-'));
  const sampleFile = path.join(tmpDir, 'insecure.js');

  fs.writeFileSync(
    sampleFile,
    `
const crypto = require('crypto');
const hash = crypto.createHash('md5').update('test').digest('hex');
eval("console.log('unsafe')");
`
  );

  const result = runCli(['@audit', sampleFile]);

  assert.equal(result.status, 1);
  assert.match(result.stdout, /OWASP Security Audit/);
  assert.match(result.stdout, /A02:2021/);
  assert.match(result.stdout, /A03:2021/);

  fs.rmSync(tmpDir, { recursive: true, force: true });
});
