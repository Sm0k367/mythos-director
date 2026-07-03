# Agent Permission Patterns — Epic Tech AI (secure Executor access)

## Minimal pattern for any agent that needs Stripe or external APIs

```yaml
---
description: Your agent description here.
mode: primary
permission:
  edit: allow
  write: allow
  bash:
    "git *": allow
    "kortix cr *": allow
    "*": ask
  mcp:
    "kortix-executor": allow
---
```

What this grants:
- Full use of the four executor MCP tools (`connectors`, `discover`, `describe`, `call`).
- Agent can discover Stripe (or any other) tools, inspect their schemas, and call them.
- The Executor Gateway resolves `STRIPE_API_KEY` server-side — the agent never sees the key.
- All calls are audited; risky actions surface as `risk: write|destructive`.

## Recommended restrictions (defense in depth)

Keep `bash` narrow:
- Only allow the git / cr commands the agent actually needs.
- Leave the catch-all `"*": ask` so a human confirms anything unexpected.

Never grant:
- Raw `curl` or `http` bash access when the executor can do the job.
- Write permissions on anything outside `.kortix/memory/` for memory-reflector.
- Secrets in the agent file or repo.

## Adding more connectors

1. Add the `[[connectors]]` block to `kortix.toml` (use the secret name only).
2. In the Machine dashboard → Customize → Connectors, paste the actual restricted key and share it with the users/agents that should have access.
3. The next session will see the connector via `connectors` tool.

This pattern is how every Epic Tech AI agent safely reaches Stripe, Groq, or any future provider.

