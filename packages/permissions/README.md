# Permission Engine — Fail-Closed

Every tool call in Mythos Director passes through this engine.

## Rules

- Unknown tool → deny
- `shell`, `fs.write`, `git.push` → ask (human approval)
- Read-only tools → allow
- Custom tools → ask on first use

## Integration

Supervisor → Permission Engine → Mythos agents / Omnimedia swarm

All decisions are logged and reviewable.
