// .vibe/commands/audit.js
const fs = require('fs');
const path = require('path');

const OWASP_CHECKS = [
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
  {
    id: 'OWASP-2026-READINESS',
    title: '2026 Readiness: API and AI Surface Hardening',
    severity: 'medium',
    message: 'Patterns linked to modern API/AI attack surface were found.',
    remediation: 'Apply prompt/input sanitization, strict schema validation, and outbound policy controls.',
    patterns: [/systemPrompt\s*\+\s*userInput/i, /prompt\s*:\s*.*\+\s*req\./i, /dangerouslyAllowBrowser/i, /llm/i]
  }
];

function evaluateChecks(content) {
  return OWASP_CHECKS.filter(check => check.patterns.some(pattern => pattern.test(content)));
}

function shouldFailAudit(issues) {
  return issues.some(issue => issue.severity === 'critical' || issue.severity === 'high');
}

function isPathInside(parentPath, childPath) {
  const parent = path.resolve(parentPath);
  const child = path.resolve(childPath);
  return child === parent || child.startsWith(`${parent}${path.sep}`);
}

module.exports = {
  command: 'audit <file>',
  describe: 'Analyze a file with OWASP Top 10 + 2026 readiness checks',
  handler: (argv) => {
    const filePath = argv.file;
    const projectRoot = process.cwd();
    const fullPath = path.isAbsolute(filePath) ? path.resolve(filePath) : path.resolve(projectRoot, filePath);

    if (!isPathInside(projectRoot, fullPath)) {
      console.error(`Error: Refusing to audit files outside the current project - ${fullPath}`);
      process.exit(1);
    }

    if (!fs.existsSync(fullPath)) {
      console.error(`Error: File not found - ${fullPath}`);
      process.exit(1);
    }

    const content = fs.readFileSync(fullPath, 'utf8');
    const issues = evaluateChecks(content);

    console.log('OWASP Security Audit (Top 10 2021 + 2026 readiness profile)');
    console.log(`Target: ${path.relative(process.cwd(), fullPath) || fullPath}`);
    console.log('');

    if (issues.length === 0) {
      console.log('No OWASP issues found by heuristic checks.');
    } else {
      console.log('Issues found:');
      issues.forEach((issue, index) => {
        console.log(`  ${index + 1}. [${issue.severity.toUpperCase()}] ${issue.id} - ${issue.title}`);
        console.log(`     ${issue.message}`);
        console.log(`     Fix: ${issue.remediation}`);
      });
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