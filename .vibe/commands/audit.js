// .vibe/commands/audit.js
const fs = require('fs');
const path = require('path');

const OWASP_WEB_TOP10_2021_CHECKS = [
  {
    id: 'A01:2021',
    title: 'Broken Access Control',
    severity: 'high',
    message: 'Potentially insecure authorization logic detected.',
    remediation: 'Enforce server-side authorization and avoid trusting client-side role flags.',
    patterns: [/role\s*===\s*['"`]admin['"`]/i, /isAdmin\s*===\s*true/i, /bypassAuth/i]
  },
  {
    id: 'A02:2021',
    title: 'Cryptographic Failures',
    severity: 'high',
    message: 'Weak crypto or insecure transport markers were found.',
    remediation: 'Use strong algorithms (AES-GCM/SHA-256+) and always enforce HTTPS/TLS validation.',
    patterns: [/createHash\(\s*['"`](md5|sha1)['"`]\s*\)/i, /http:\/\//i, /rejectUnauthorized\s*:\s*false/i]
  },
  {
    id: 'A03:2021',
    title: 'Injection',
    severity: 'critical',
    message: 'Dangerous dynamic code/command execution patterns detected.',
    remediation: 'Avoid eval/exec with untrusted input and use parameterized queries and safe APIs.',
    patterns: [/\beval\s*\(/i, /new Function\s*\(/i, /child_process\.(exec|execSync)\s*\(/i, /`\s*select\s+.+\$\{/i]
  },
  {
    id: 'A04:2021',
    title: 'Insecure Design',
    severity: 'medium',
    message: 'Design-time security placeholders or skipped controls found.',
    remediation: 'Resolve TODO/FIXME security debt before release and validate threat models.',
    patterns: [/\bTODO\b/i, /FIXME.*security/i, /skip.*auth/i]
  },
  {
    id: 'A05:2021',
    title: 'Security Misconfiguration',
    severity: 'high',
    message: 'Likely insecure defaults/configuration found.',
    remediation: 'Harden CORS, disable debug settings in production, and avoid wildcard trust.',
    patterns: [/Access-Control-Allow-Origin['"`]?\s*[:=]\s*['"`]\*/i, /cors\s*\(\s*\{[^}]*origin:\s*['"`]\*/i, /NODE_ENV\s*!==\s*['"`]production['"`]/i]
  },
  {
    id: 'A06:2021',
    title: 'Vulnerable and Outdated Components',
    severity: 'medium',
    message: 'Dependency hygiene marker found in source comments/scripts.',
    remediation: 'Run npm audit and keep dependencies updated/pinned.',
    patterns: [/npm audit fix --force/i, /TODO.*upgrade dependency/i]
  },
  {
    id: 'A07:2021',
    title: 'Identification and Authentication Failures',
    severity: 'high',
    message: 'Authentication/session validation patterns look weak.',
    remediation: 'Verify tokens/signatures server-side and avoid plain-text credential handling.',
    patterns: [/jwt\.decode\s*\(/i, /password\s*===/i, /token\s*==\s*['"`]/i]
  },
  {
    id: 'A08:2021',
    title: 'Software and Data Integrity Failures',
    severity: 'high',
    message: 'Code integrity safeguards may be bypassed.',
    remediation: 'Enforce signature/integrity checks and disable unsafe install flags.',
    patterns: [/--ignore-scripts/i, /\bintegrity\s*:\s*false/i, /verify\s*:\s*false/i]
  },
  {
    id: 'A09:2021',
    title: 'Security Logging and Monitoring Failures',
    severity: 'medium',
    message: 'Insufficient or unsafe logging/error handling patterns detected.',
    remediation: 'Add structured security logging and avoid silently swallowing critical errors.',
    patterns: [/console\.log/i, /catch\s*\(\s*\w+\s*\)\s*\{\s*\}/i, /\/\/\s*ignore error/i]
  },
  {
    id: 'A10:2021',
    title: 'Server-Side Request Forgery (SSRF)',
    severity: 'high',
    message: 'Network request construction may allow untrusted URL input.',
    remediation: 'Validate/allowlist outbound hosts and never fetch user-supplied URLs directly.',
    patterns: [/fetch\s*\(\s*\w+\s*\)/i, /axios\.(get|post|request)\s*\(\s*\w+/i, /request\s*\(\s*\w+\s*\)/i]
  },
];

const OWASP_AGENTIC_TOP10_2026_CHECKS = [
  {
    id: 'ASI01:2026',
    title: 'Agent Goal Hijack',
    severity: 'high',
    message: 'Inputs may allow agent goal redirection via prompt or instruction injection.',
    remediation: 'Treat all natural language inputs as untrusted and enforce intent validation before goal/tool changes.',
    patterns: [/systemPrompt\s*\+\s*userInput/i, /ignore previous instructions/i, /goal override/i, /prompt injection/i]
  },
  {
    id: 'ASI02:2026',
    title: 'Tool Misuse and Exploitation',
    severity: 'high',
    message: 'Tool calls appear over-privileged or potentially unsafe.',
    remediation: 'Apply least-agency permissions, action approvals, and schema/policy gates per tool invocation.',
    patterns: [/tool\.(run|execute)\s*\(/i, /mcp/i, /rm\s+-rf/i, /shell\s*:\s*true/i]
  },
  {
    id: 'ASI03:2026',
    title: 'Identity and Privilege Abuse',
    severity: 'high',
    message: 'Delegated identity or privilege handling may be unsafe.',
    remediation: 'Use short-lived credentials, bind permissions to subject/purpose/duration, and re-auth on context switch.',
    patterns: [/impersonate/i, /assumeRole/i, /delegatedToken/i, /serviceAccountKey/i]
  },
  {
    id: 'ASI04:2026',
    title: 'Agentic Supply Chain Vulnerabilities',
    severity: 'high',
    message: 'Dynamic dependency or tool registry trust may expose the agentic supply chain.',
    remediation: 'Pin dependencies/prompts/tools by version/hash and require provenance attestation.',
    patterns: [/latest/i, /unverified plugin/i, /agent\.json/i, /tool descriptor/i]
  },
  {
    id: 'ASI05:2026',
    title: 'Unexpected Code Execution (RCE)',
    severity: 'critical',
    message: 'Generated or delegated execution pathways could enable adversarial code execution.',
    remediation: 'Ban eval-style execution in production paths and isolate execution in strict sandboxes.',
    patterns: [/\beval\s*\(/i, /execSync\s*\(/i, /new Function\s*\(/i, /deserialize\s*\(/i]
  },
  {
    id: 'ASI06:2026',
    title: 'Memory & Context Poisoning',
    severity: 'high',
    message: 'Persistent memory/context usage may ingest untrusted poisoned data.',
    remediation: 'Sanitize memory writes, validate retrieval sources, and monitor for context drift.',
    patterns: [/memory\.save/i, /vectorStore\.(upsert|add)/i, /rag/i, /long[-\s]?term memory/i]
  },
  {
    id: 'ASI07:2026',
    title: 'Insecure Inter-Agent Communication',
    severity: 'high',
    message: 'Inter-agent communication appears weakly authenticated or unencrypted.',
    remediation: 'Use mTLS/signatures, anti-replay controls, and strict protocol/version pinning.',
    patterns: [/a2a/i, /agent[-\s]?to[-\s]?agent/i, /postMessage/i, /http:\/\/.*agent/i]
  },
  {
    id: 'ASI08:2026',
    title: 'Cascading Failures',
    severity: 'medium',
    message: 'Autonomous chaining may amplify a single fault into multi-agent/system-wide impact.',
    remediation: 'Add blast-radius controls, circuit breakers, and human gates for high-impact propagation.',
    patterns: [/auto[-\s]?retry/i, /for\s*\(\s*;;\s*\)/i, /while\s*\(\s*true\s*\)/i, /fan[-\s]?out/i]
  },
  {
    id: 'ASI09:2026',
    title: 'Human-Agent Trust Exploitation',
    severity: 'medium',
    message: 'Language patterns may manipulate user trust for unsafe actions.',
    remediation: 'Require explicit confirmation and anti-social-engineering prompts for sensitive decisions.',
    patterns: [/trust me/i, /do not tell/i, /urgent transfer/i, /bypass review/i]
  },
  {
    id: 'ASI10:2026',
    title: 'Rogue Agents',
    severity: 'high',
    message: 'Autonomous behavior may exceed approved scope or governance constraints.',
    remediation: 'Enforce immutable policy boundaries, continuous supervision, and emergency kill switches.',
    patterns: [/self[-\s]?modify/i, /autonomous mode/i, /disable guardrails/i, /run unsupervised/i]
  }
];

function evaluateChecks(content, checks) {
  return checks.filter(check => check.patterns.some(pattern => pattern.test(content)));
}

function printIssues(title, issues, startingIndex) {
  if (issues.length === 0) {
    console.log(`${title}: no issues found by heuristic checks.`);
    return startingIndex;
  }

  console.log(`${title}:`);
  issues.forEach((issue, index) => {
    const issueNumber = startingIndex + index;
    console.log(`  ${issueNumber}. [${issue.severity.toUpperCase()}] ${issue.id} - ${issue.title}`);
    console.log(`     ${issue.message}`);
    console.log(`     Fix: ${issue.remediation}`);
  });
  return startingIndex + issues.length;
}

function shouldFailAudit(issues) {
  return issues.some(issue => issue.severity === 'critical' || issue.severity === 'high');
}

module.exports = {
  command: 'audit <file>',
  describe: 'Analyze a file with OWASP Top 10 + Agentic ASI Top 10 (2026) checks',
  handler: (argv) => {
    const filePath = argv.file;
    const projectRoot = process.cwd();
    const requestedPath = path.isAbsolute(filePath) ? path.resolve(filePath) : path.resolve(projectRoot, filePath);

    if (!fs.existsSync(requestedPath)) {
      console.error(`Error: File not found - ${requestedPath}`);
      process.exit(1);
    }

    const projectRootRealPath = fs.realpathSync(projectRoot);
    const targetRealPath = fs.realpathSync(requestedPath);
    const inProject =
      targetRealPath === projectRootRealPath ||
      targetRealPath.startsWith(`${projectRootRealPath}${path.sep}`);

    if (!inProject) {
      console.error(`Error: Refusing to audit files outside the current project - ${targetRealPath}`);
      process.exit(1);
    }

    const content = fs.readFileSync(targetRealPath, 'utf8');
    const webIssues = evaluateChecks(content, OWASP_WEB_TOP10_2021_CHECKS);
    const agenticIssues = evaluateChecks(content, OWASP_AGENTIC_TOP10_2026_CHECKS);
    const issues = [...webIssues, ...agenticIssues];

    console.log('OWASP Security Audit (Web Top 10 2021 + Agentic ASI Top 10 2026)');
    console.log(`Target: ${path.relative(process.cwd(), targetRealPath) || targetRealPath}`);
    console.log('');

    if (issues.length === 0) {
      console.log('No OWASP issues found by heuristic checks.');
    } else {
      console.log('Issues found:');
      const nextIndex = printIssues('OWASP Top 10 (Web 2021)', webIssues, 1);
      printIssues('OWASP Agentic Top 10 (2026)', agenticIssues, nextIndex);
    }
    console.log('');
    console.log('💡 Next Steps:');
    if (issues.length > 0) {
      console.log('  1. Fix the issues listed above (prioritize CRITICAL/HIGH first).');
      console.log('  2. Re-run readiness check:');
      console.log('     vibe @doctor');
      console.log('  3. Run cleanup pass if needed:');
      console.log(`     vibe @cleanup ${filePath}`);
    }
    console.log('  4. Generate tests if not already done:');
    console.log(`     vibe @gen-tests ${filePath}`);
    console.log('  5. Commit your changes:');
    console.log('     git add <files>');
    console.log('     vibe @commit');

    if (shouldFailAudit(issues)) {
      process.exitCode = 1;
    }
  }
};