# Vibe CLI Cheat Sheet

## Quick Reference for Commands, Agents, and Workflow

---

## 🚀 Commands

### `@scaffold <componentName>` or `/scaffold <componentName>`
**Purpose:** Generate boilerplate code for a new component.
**Example:**
```bash
node test-vibe.js @scaffold UserProfile
# or
node test-vibe.js /scaffold UserProfile
```
**Output:**
- `src/<componentName>/<componentName>.jsx` (React component)
- `src/<componentName>/<componentName>.test.js` (Test file)

---

### `@gen-tests <filePath>` or `/gen-tests <filePath>`
**Purpose:** Generate tests for a file.
**Example:**
```bash
node test-vibe.js @gen-tests src/UserProfile/UserProfile.jsx
# or
node test-vibe.js /gen-tests src/UserProfile/UserProfile.jsx
```
**Output:**
- `src/<componentName>/<componentName>.test.js` (Test file)

---

### `@cleanup <filePath>` or `/cleanup <filePath>`
**Purpose:** Remove dead code and refactor.
**Example:**
```bash
node test-vibe.js @cleanup src/UserProfile/UserProfile.jsx
# or
node test-vibe.js /cleanup src/UserProfile/UserProfile.jsx
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
node test-vibe.js @secure-func "Fetch user data from API"
# or
node test-vibe.js /secure-func "Fetch user data from API"
```
**Output:**
- `src/utils/<function-name>.js` (Secure function)

---

### `@data-model <name>` or `/data-model <name>`
**Purpose:** Generate a data model.
**Example:**
```bash
node test-vibe.js @data-model User
# or
node test-vibe.js /data-model User
```
**Output:**
- `src/models/<name>.js` (Data model)

---

### `@audit <filePath>` or `/audit <filePath>`
**Purpose:** Analyze a file for issues (e.g., `console.log`, hardcoded secrets, TODOs).
**Example:**
```bash
node test-vibe.js @audit src/UserProfile/UserProfile.jsx
# or
node test-vibe.js /audit src/UserProfile/UserProfile.jsx
```
**Checks:**
- `console.log` statements
- Hardcoded secrets (`password`, `secret`)
- TODO comments

---

### `@commit` or `/commit`
**Purpose:** Generate a conventional commit message.
**Example:**
```bash
node test-vibe.js @commit
# or
node test-vibe.js /commit
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
node test-vibe.js end-session
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
node test-vibe.js start-session
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
   node test-vibe.js @scaffold <componentName>
   # or
   node test-vibe.js /scaffold <componentName>
   ```
2. **Generate data models**
   ```bash
   node test-vibe.js @data-model <name>
   # or
   node test-vibe.js /data-model <name>
   ```

### Phase 2: Implement
1. **Write secure functions**
   ```bash
   node test-vibe.js @secure-func <description>
   # or
   node test-vibe.js /secure-func <description>
   ```
2. **Integrate with existing code**
   - Check for conflicts and route overlaps.

### Phase 3: Verify
1. **Audit the code**
   ```bash
   node test-vibe.js @audit <filePath>
   # or
   node test-vibe.js /audit <filePath>
   ```
2. **Generate tests**
   ```bash
   node test-vibe.js @gen-tests <filePath>
   # or
   node test-vibe.js /gen-tests <filePath>
   ```
3. **Run tests**
   ```bash
   npm test
   ```

### Phase 4: Review
1. **Clean up code**
   ```bash
   node test-vibe.js @cleanup <filePath>
   # or
   node test-vibe.js /cleanup <filePath>
   ```
2. **Final audit**
   ```bash
   node test-vibe.js @audit <filePath>
   # or
   node test-vibe.js /audit <filePath>
   ```

### Phase 5: Commit
1. **Stage changes**
   ```bash
   git add <files>
   ```
2. **Generate commit message**
   ```bash
   node test-vibe.js @commit
   # or
   node test-vibe.js /commit
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
   node test-vibe.js gen-tests <filePath>
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
   node test-vibe.js @scaffold UserProfile
   node test-vibe.js @data-model User
   ```
2. **Implement secure functions**
   ```bash
   node test-vibe.js @secure-func "Fetch user data from API"
   node test-vibe.js @secure-func "Update user profile"
   ```
3. **Audit the code**
   ```bash
   node test-vibe.js @audit src/UserProfile
   ```
4. **Generate and run tests**
   ```bash
   node test-vibe.js @gen-tests src/UserProfile/UserProfile.jsx
   npm test
   ```
5. **Clean up and final audit**
   ```bash
   node test-vibe.js @cleanup src/UserProfile
   node test-vibe.js @audit src/UserProfile
   ```
6. **Commit changes**
   ```bash
   git add src/UserProfile/
   node test-vibe.js @commit
   git commit -m "feat(profile): add user profile page with secure API calls"
   ```

---

## 🎯 Best Practices

- **SOLID Principles:** Keep functions small, single-purpose, and testable.
- **DRY (Don’t Repeat Yourself):** Reuse templates, agents, and skills.
- **KISS (Keep It Simple):** Avoid over-engineering; focus on clarity.
- **Security First:** Always audit code before committing.
- **Test Coverage:** Ensure all functions have corresponding tests.
