# Epic Tech AI

**The secure autonomous platform that gives agents real power — with Stripe, SOTA models, and an unforgettable project memory brain — without ever leaking a key.**

Contact: epictechai@gmail.com · x.com/@EpicTechAI

---

## What makes Epic Tech AI different

Most "agent platforms" give you chatbots that can read files. Epic Tech AI gives you **production-grade autonomous agents** that can:

- Create real Stripe charges via a restricted key you control
- Call any SOTA model (Groq, Anthropic, OpenAI, etc.) through a unified gateway
- Maintain a living project memory (`.kortix/memory/`) that survives every session
- Never see a secret — the Executor Gateway injects credentials server-side
- Every action is audited, every risky call can be confirmed

This is not a toy. This is the foundation for Epic Tech AI's revenue-generating, secure, developer-first platform.

---

## Architecture that actually works

### 1. The Executor Gateway (kortix-executor)

Agents never receive raw API keys. They talk to a single MCP server with four tools:

| Tool | Purpose |
|------|---------|
| `connectors` | List every integration available to this session |
| `discover` | Intent search ("create a charge", "send slack message") |
| `describe` | Full JSON schema + risk level before you call anything |
| `call` | Execute with the gateway-injected credential |

The gateway resolves `STRIPE_API_KEY`, `GROQ_API_KEY`, etc. from the Machine dashboard secrets. The agent only sees the result.

### 2. Restricted Stripe Key (never in git)

You create a **restricted key** in Stripe with only the scopes you need:

- `charges.create`
- `customers.create`
- `payment_intents.create`
- `checkout.sessions.create`

Nothing else. No refunds, no payouts, no account admin. The key name in the platform is always `STRIPE_API_KEY`.

You paste the actual value once in the Machine dashboard → Connectors. That's it.

### 3. Agent Permission Model

Every agent declares exactly what it can do in its frontmatter:

```yaml
permission:
  edit: allow
  write: allow
  bash:
    "git *": allow
    "kortix cr *": allow
    "*": ask
  mcp:
    "kortix-executor": allow
```

The `mcp: "kortix-executor": allow` line is the on-ramp to every external API. No raw `curl`, no bearer tokens in prompts, no accidental key leaks.

### 4. The Memory Brain (`.kortix/memory/`)

Every project has a living knowledge base that agents curate. The `memory-reflector` agent:

- Runs on a cron (default daily at 03:00 UTC)
- Surveys git history, merged CRs, recent sessions
- Uses a human-editable rubric to decide what is durable and team-relevant
- Writes via the `memory` tool only (not generic file tools)
- Opens a single `memory: …` change request for human review
- Exits silently on days when nothing is worth remembering

This is how Epic Tech AI keeps context across thousands of sessions without hallucinating old state.

### 5. Change Requests — the only way to land work

No agent ever merges its own code. Every memory edit, every code change, every connector addition goes through the CR flow:

```sh
git add .
git commit -m "memory: add Stripe connector pattern"
git push origin HEAD
kortix cr open --title "memory: add Stripe connector pattern" --description "..."
```

Humans review. Humans merge. Agents stay in their lane.

---

## Quick start (secure by default)

1. **Fork / clone** this repo as `epic-tech-ai`
2. **Add secrets in the Machine dashboard**:
   - `STRIPE_API_KEY` (your restricted Stripe key)
   - `GROQ_API_KEY` (or any model provider key)
3. **Declare connectors** in `kortix.toml` (already done for Stripe)
4. **Grant agents the executor permission** (see `.kortix/opencode/agents/PERMISSION-PATTERNS.md`)
5. **Enable the memory-reflector trigger** when you have enough activity
6. **Ship** — every agent call is audited, every CR is reviewable, every key stays secret

---

## Pricing & Profit (human-controlled)

Epic Tech AI does not let agents autonomously decide to charge customers. You define pricing tiers, landing pages, and Stripe Checkout flows. The agent can:

- Create a Checkout session via the executor
- Read recent charges for reporting
- Update customer records

A human (or a narrowly-scoped, explicitly-approved agent workflow) still controls the "charge user $X" moment. This keeps you compliant and profitable without rogue agents.

---

## Rebranding note

All original "Smoke" / "Jarvis" references have been replaced. Current identity:

- **Epic Tech AI**
- Contact: epictechai@gmail.com
- X: @EpicTechAI

Future connectors, agents, and docs should carry this branding.

---

## Files you care about

| Path | Purpose |
|------|---------|
| `kortix.toml` | Project manifest, triggers, connectors, secrets names |
| `.kortix/opencode/agents/` | All agent definitions + `PERMISSION-PATTERNS.md` |
| `.kortix/opencode/skills/kortix-memory/` | Rubric + `memory` tool implementation |
| `.kortix/opencode/skills/kortix-executor/` | The four MCP tools and connector discovery |
| `.kortix/memory/` | The living project brain (edit via CR only) |
| `README.md` | This file — update whenever architecture changes |

---

## Security posture (non-negotiable)

- No API keys in git, prompts, agent memory, or environment files
- Agents only reach the outside world through the Executor Gateway
- Every connector uses the narrowest possible auth scope
- Risky operations (`write` / `destructive`) are declared in tool metadata
- Memory edits require human review via CR
- All calls are logged and attributable

This is how Epic Tech AI ships a legitimate, auditable, revenue-generating platform without ever handing an agent a live key.

---

**Epic Tech AI — autonomous when it should be, secure when it must be, profitable by design.**

Contact: epictechai@gmail.com · x.com/@EpicTechAI

---
*Repository originally forked from the Machine platform. All branding, security patterns, and connector architecture updated for Epic Tech AI production use.*
