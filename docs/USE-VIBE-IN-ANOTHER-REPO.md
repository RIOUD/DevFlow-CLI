# Use Mistral `vibe` With DevFlow Settings (Super Simple)

You want this:
1. Open repo in Cursor
2. Open terminal
3. Type `vibe`
4. Mistral starts **with your DevFlow workflow loaded**

This guide does exactly that.

## What We Are Doing

- `vibe` stays Mistral (no rename)
- We add a tiny starter message (bootstrap) from this repo
- So every `vibe` session starts with DevFlow rules

---

## Step 1: Copy DevFlow Files Into Your Other Repo

Go to your other project:

```bash
cd /path/to/my-app
```

Copy DevFlow files:

```bash
cp -r /home/ricky/DevFlow-CLI/.vibe .
cp /home/ricky/DevFlow-CLI/.viberc .
cp /home/ricky/DevFlow-CLI/test-vibe.js .
```

Now your repo has the same DevFlow settings.

---

## Step 2: Add Auto-Bootstrap Function To `~/.bashrc`

Open your `~/.bashrc` and add this function:

```bash
vibe() {
  local real_vibe="/home/ricky/.local/share/uv/tools/mistral-vibe/bin/vibe"
  local bootstrap=".vibe/mistral-devflow-bootstrap.md"

  if [ $# -eq 0 ] && [ -f "$bootstrap" ]; then
    command "$real_vibe" --workdir "$PWD" "$(cat "$bootstrap")"
  else
    command "$real_vibe" "$@"
  fi
}
```

Then reload terminal config:

```bash
source ~/.bashrc
```

What this means:
- If a repo has `.vibe/mistral-devflow-bootstrap.md`, `vibe` starts with DevFlow flow.
- If not, `vibe` works normally.

---

## Step 3: Use It

Inside your repo:

```bash
vibe
```

That starts Mistral with DevFlow workflow preloaded.

---

## Quick Check

Inside that same repo:

```bash
node test-vibe.js @doctor
node test-vibe.js @audit test-vibe.js
```

If these work, DevFlow is fully active in that repo.

---

## Fast Copy-Paste Block

```bash
cd /path/to/my-app
cp -r /home/ricky/DevFlow-CLI/.vibe .
cp /home/ricky/DevFlow-CLI/.viberc .
cp /home/ricky/DevFlow-CLI/test-vibe.js .
source ~/.bashrc
vibe
```

Done. You now type `vibe` and get Mistral + DevFlow flow together.
