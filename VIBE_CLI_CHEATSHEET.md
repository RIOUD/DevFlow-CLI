# DevFlow CLI Cheat Sheet

**Optimized for use with Mistral AI's Vibe CLI.**

This cheat sheet provides **workflows and commands** tailored to enhance your experience with Mistral AI's Vibe CLI. It is **not** affiliated with or endorsed by Mistral AI but is designed to complement their tools.

## Quick Reference for Commands, Agents, and Workflow
=======

---

## 🚀 Commands

### `--help` or `help`
**Purpose:** Show all available commands with descriptions.
**Example:**
```bash
vibe --help
# or
vibe help
```

---

### `@scaffold <componentName>` or `/scaffold <componentName>`
**Purpose:** Generate boilerplate code for a new component.
**Example:**
```bash
vibe @scaffold UserProfile
# or
vibe /scaffold UserProfile
```
**Output:**
- `src/<componentName>/<componentName>.jsx` (React component)
- `src/<componentName>/<componentName>.test.js` (Test file)

---

### `@gen-tests <filePath>` or `/gen-tests <filePath>`
**Purpose:** Generate tests for a file.
**Example:**
```bash
vibe @gen-tests src/UserProfile/UserProfile.jsx
# or
vibe /gen-tests src/UserProfile/UserProfile.jsx
```
**Output:**
- `src/<componentName>/<componentName>.test.js` (Test file)

---

### `@cleanup <filePath>` or `/cleanup <filePath>`
**Purpose:** Remove dead code and refactor.
**Example:**
```bash
vibe @cleanup src/UserProfile/UserProfile.jsx
# or
vibe /cleanup src/UserProfile/UserProfile.jsx
```
**Actions:**
- Removes unused imports
- Removes `console.log` statements
- Removes TODO comments

---

### `@secure-func <description>` or `/secure-func <description>`
**Purpose:** Generate a secure function.
**Example:**
```bash
vibe @secure-func "Fetch user data from API"
# or
vibe /secure-func "Fetch user data from API"
```
**Output:**
- `src/utils/<function-name>.js` (Secure function)

---

### `@data-model <name>` or `/data-model <name>`
**Purpose:** Generate a data model.
**Example:**
```bash
vibe @data-model User
# or
vibe /data-model User
```
**Output:**
- `src/models/<name>.js` (Data model)

---

### `@audit <filePath>` or `/audit <filePath>`
**Purpose:** Analyze a file against OWASP Web Top 10 (2021) and OWASP Agentic ASI Top 10 (2026).
**Example:**
```bash
vibe @audit src/UserProfile/UserProfile.jsx
# or
vibe /audit src/UserProfile/UserProfile.jsx
```
**Checks:**
- OWASP Web Top 10 categories (`A01` through `A10`)
- OWASP Agentic Top 10 categories (`ASI01` through `ASI10`)
- Heuristic checks for injection, tool misuse, memory poisoning, inter-agent communication, and cascading failures

**Source:** `docs/OWASP-Top-10-for-Agentic-Applications-2026-12.6-1.pdf`

---

### `@doctor` or `/doctor`
**Purpose:** Validate environment and project readiness before you start coding.
**Example:**
```bash
vibe @doctor
# or
vibe /doctor
```
**Checks:**
- Node.js and npm availability/version
- Git availability and repo context
- `.vibe`, `.viberc`, and command path readiness
- Write permissions for workspace and `.vibe`

---

### `@commit` or `/commit`
**Purpose:** Generate a conventional commit message.
**Example:**
```bash
vibe @commit
# or
vibe /commit
```
**Output:**
```plaintext
feat(master): Add changes for master
```

---

### `@end-session`
**Purpose:** Summarize the work done and suggest next steps.
**Example:**
```bash
vibe end-session
```
**Output:**
- Saves session summary to `.vibe/session.log`.
- Lists staged/uncommitted changes.
- Suggests next steps (commit, push, etc.).

---

### `@start-session`
**Purpose:** Resume the previous session and suggest next steps.
**Example:**
```bash
vibe start-session
```
**Output:**
- Reads `.vibe/session.log`.
- Displays the previous session summary.
- Suggests next steps (review, commit, etc.).

---

## 🤖 Agents

### Scaffold Agent
**Purpose:** Automates the scaffolding workflow.
**Usage:**
```javascript
const scaffoldAgent = require('./.vibe/agents/scaffold-agent');
scaffoldAgent.execute('ComponentName');
```
**Workflow:**
1. Prompt for component type
2. Generate files
3. Generate tests
4. Confirm completion

---

### Test Agent
**Purpose:** Automates test generation and auditing.
**Usage:**
```javascript
const testAgent = require('./.vibe/agents/test-agent');
testAgent.execute('src/UserProfile/UserProfile.jsx');
```
**Workflow:**
1. Generate tests
2. Audit the tests
3. Confirm completion

---

### Security Agent
**Purpose:** Automates security audits and suggests fixes.
**Usage:**
```javascript
const securityAgent = require('./.vibe/agents/security-agent');
securityAgent.execute('src/UserProfile/UserProfile.jsx');
```
**Workflow:**
1. Audit the code
2. Suggest fixes
3. Confirm completion

---

## 🛠 Skills

### Security Audit
**Purpose:** Analyze code for security vulnerabilities.
**Usage:**
```javascript
const securityAudit = require('./.vibe/skills/security-audit');
securityAudit.execute(['file1.js', 'file2.js']);
```
**Checks:**
- Hardcoded secrets
- TODO comments

---

### Performance Audit
**Purpose:** Analyze code for performance bottlenecks.
**Usage:**
```javascript
const performanceAudit = require('./.vibe/skills/performance-audit');
performanceAudit.execute(['file1.js', 'file2.js']);
```
**Checks:**
- Blocking I/O (e.g., `time.sleep()`)
- Synchronous requests
- Heavy loops

---

### Code Coverage
**Purpose:** Analyze test coverage.
**Usage:**
```javascript
const codeCoverage = require('./.vibe/skills/code-coverage');
codeCoverage.execute(['file1.js', 'file2.js']);
```
**Checks:**
- Missing test files
- Test coverage gaps

---

### Dependency Check
**Purpose:** Analyze dependencies for vulnerabilities.
**Usage:**
```javascript
const dependencyCheck = require('./.vibe/skills/dependency-check');
dependencyCheck.execute();
```
**Checks:**
- Unpinned dependency versions
- Vulnerable dependencies

---

## 📝 Desired Workflow

### Phase 1: Setup
1. **Start a new feature**
   ```bash
   vibe @scaffold <componentName>
   # or
   vibe /scaffold <componentName>
   ```
2. **Generate data models**
   ```bash
   vibe @data-model <name>
   # or
   vibe /data-model <name>
   ```

### Phase 2: Implement
1. **Write secure functions**
   ```bash
   vibe @secure-func <description>
   # or
   vibe /secure-func <description>
   ```
2. **Integrate with existing code**
   - Check for conflicts and route overlaps.

### Phase 3: Verify
1. **Audit the code**
   ```bash
   vibe @audit <filePath>
   # or
   vibe /audit <filePath>
   ```
2. **Generate tests**
   ```bash
   vibe @gen-tests <filePath>
   # or
   vibe /gen-tests <filePath>
   ```
3. **Run tests**
   ```bash
   npm test
   ```

### Phase 4: Review
1. **Clean up code**
   ```bash
   vibe @cleanup <filePath>
   # or
   vibe /cleanup <filePath>
   ```
2. **Final audit**
   ```bash
   vibe @audit <filePath>
   # or
   vibe /audit <filePath>
   ```

### Phase 5: Commit
1. **Stage changes**
   ```bash
   git add <files>
   ```
2. **Generate commit message**
   ```bash
   vibe @commit
   # or
   vibe /commit
   ```
3. **Commit changes**
   ```bash
   git commit -m "<generated-message>"
   ```

---

## 📌 Quick Tips

- **Templates:** Customize templates in `.vibe/templates/` for different file types:
  - `react-component.js`: React component template.
  - `service.js`: Service template (SOLID, DI).
  - `hook.js`: React hook template.
  - `utility.js`: Utility function template.
  - `model.js`: Data model template.
- **Agents:** Create new agents in `.vibe/agents/` to automate workflows.
- **Skills:** Add new skills in `.vibe/skills/` for reusable utilities.
- **Commands:** Extend functionality by adding new commands in `.vibe/commands/`.

---

## 🔧 Customization

### Add a New Command
1. Create a new file in `.vibe/commands/` (e.g., `gen-tests.js`).
2. Define the command:
   ```javascript
   module.exports = {
     command: 'gen-tests <file>',
     describe: 'Generate tests for a file',
     handler: (argv) => {
       // Implement test generation logic
     }
   };
   ```
3. Use the command:
   ```bash
   vibe gen-tests <filePath>
   ```

### Add a New Template
1. Create a new template file in `.vibe/templates/` (e.g., `service.js`).
2. Use placeholders like `{{componentName}}` for dynamic content.
3. Update the `scaffold` command to use the new template.

---

## 📖 Example Workflow

### Goal: Add a New User Profile Page

1. **Scaffold the component and data model**
   ```bash
   vibe @scaffold UserProfile
   vibe @data-model User
   ```
2. **Implement secure functions**
   ```bash
   vibe @secure-func "Fetch user data from API"
   vibe @secure-func "Update user profile"
   ```
3. **Audit the code**
   ```bash
   vibe @audit src/UserProfile
   ```
4. **Generate and run tests**
   ```bash
   vibe @gen-tests src/UserProfile/UserProfile.jsx
   npm test
   ```
5. **Clean up and final audit**
   ```bash
   vibe @cleanup src/UserProfile
   vibe @audit src/UserProfile
   ```
6. **Commit changes**
   ```bash
   git add src/UserProfile/
   vibe @commit
   git commit -m "feat(profile): add user profile page with secure API calls"
   ```

---

## 🎯 Best Practices

- **SOLID Principles:** Keep functions small, single-purpose, and testable.
- **DRY (Don’t Repeat Yourself):** Reuse templates, agents, and skills.
- **KISS (Keep It Simple):** Avoid over-engineering; focus on clarity.
- **Security First:** Always audit code before committing.
- **Test Coverage:** Ensure all functions have corresponding tests.
