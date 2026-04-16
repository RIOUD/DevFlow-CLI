# Mistral + DevFlow Startup (Copy/Paste)

Use this when you want Mistral `vibe` to start with DevFlow workflow context.

## One-Time Shell Setup (`~/.bashrc`)

Copy/paste this once:

```bash
cat >> ~/.bashrc <<'EOF'
vibe() {
  local real_vibe="/home/ricky/.local/share/uv/tools/mistral-vibe/bin/vibe"
  local bootstrap=".vibe/mistral-devflow-bootstrap.md"

  if [ $# -eq 0 ] && [ -f "$bootstrap" ]; then
    command "$real_vibe" --workdir "$PWD" "$(cat "$bootstrap")"
  else
    command "$real_vibe" "$@"
  fi
}
EOF
source ~/.bashrc
hash -r
```

## Per-Repo Setup

Inside the target repo, copy DevFlow files:

```bash
cp -r /home/ricky/DevFlow-CLI/.vibe .
cp /home/ricky/DevFlow-CLI/.viberc .
cp /home/ricky/DevFlow-CLI/test-vibe.js .
```

## Startup Command

In that repo terminal:

```bash
vibe
```

## Quick Verify

```bash
type vibe
ls -l .vibe/mistral-devflow-bootstrap.md
```

Expected:
- `vibe is a function`
- bootstrap file exists
