# Gemini + DevFlow Startup (Copy/Paste)

Use this guide if you start Gemini with:

```bash
gemini
```

and want it to automatically include your DevFlow workflow context.

---

## 1) One-Time Shell Setup (`~/.bashrc`)

Add this function to your `~/.bashrc`:

```bash
gemini() {
  local repo_bootstrap=".vibe/mistral-devflow-bootstrap.md"
  local global_bootstrap="/home/ricky/DevFlow-CLI/.vibe/mistral-devflow-bootstrap.md"

  if [ $# -eq 0 ] && [ -f "$repo_bootstrap" ]; then
    command gemini --prompt-interactive "$(cat "$repo_bootstrap")"
  elif [ $# -eq 0 ] && [ -f "$global_bootstrap" ]; then
    command gemini --prompt-interactive "$(cat "$global_bootstrap")"
  else
    command gemini "$@"
  fi
}
```

Reload shell:

```bash
source ~/.bashrc
hash -r
```

What this does:
- If repo has `.vibe/mistral-devflow-bootstrap.md`, use it.
- Else fallback to `/home/ricky/DevFlow-CLI/.vibe/mistral-devflow-bootstrap.md`.
- If you pass flags/args, Gemini runs normally.

---

## 2) Per-Repo DevFlow Setup (Recommended)

Inside your target repo:

```bash
cp -r /home/ricky/DevFlow-CLI/.vibe .
cp /home/ricky/DevFlow-CLI/.viberc .
cp /home/ricky/DevFlow-CLI/test-vibe.js .
```

This gives that repo full local DevFlow tooling (`@doctor`, `@audit`, `@commit`, etc).

---

## 3) Startup Command

In that repo terminal:

```bash
gemini
```

---

## 4) Verify It Is Active

Run:

```bash
type gemini
ls -l .vibe/mistral-devflow-bootstrap.md
```

Expected:
- `gemini is a function`
- bootstrap file exists (or fallback file exists in `DevFlow-CLI`)

Then ask Gemini:

```text
Before we start, list the workflow you must follow in this repo.
```

You should see DevFlow flow (`@doctor`, `@audit`, tests, commit discipline).

---

## 5) Quick Troubleshooting

- **Problem:** `ls: cannot access '.vibe/mistral-devflow-bootstrap.md'`
  - **Fix:** copy `.vibe` into that repo (step 2), or rely on global fallback path.

- **Problem:** `type gemini` shows binary, not function
  - **Fix:** `source ~/.bashrc` and re-open terminal.

- **Problem:** Gemini starts without DevFlow instructions
  - **Fix:** ensure bootstrap file exists and wrapper function is loaded in that shell session.
