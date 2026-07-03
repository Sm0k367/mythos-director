# Iron Jarvis

**Your own local-first AI operating system.**

Agents that plan, build, review, schedule, remember, and wire themselves into your world — running on *your* machine, under *your* control.

No cloud lock-in. No black boxes. Every action logged, every change reviewable, every secret encrypted on your disk.

---

## What Iron Jarvis actually is

Iron Jarvis turns a fleet of AI agents into a **real operating system**:

- A **Supervisor** decomposes your goal and spins up specialist subagents
- Every tool call passes a **fail-closed permission engine**
- Code changes land on git branches and **never auto-merge** — you review the diff
- Four-layer memory + **long-term memory** (Obsidian, Notion, markdown)
- **n8n-style visual workflow canvas** — agents can build and edit workflows you then see and control
- **Voice-to-text** + encrypted secrets vault + schedules + webhooks
- **Self-development** — an opt-in Maintainer agent can improve Iron Jarvis itself (review-gated)
- **Multimodal intelligence** — real-time video generation, 3D worlds, live agent collaboration
- **Real Agent Economy** — publish, sell, and install skills with automatic payments
- **Self-evolving platform** — the system proposes and ships better versions of itself
- **Planetary orchestration** — thousands of agents, cross-org workflows, global edge runtime
- **Enterprise fortress** — SSO, advanced RBAC, compliance automation
- **Developer platform** — SDKs, white-label, plugin ecosystem

Runs **fully offline** with local models. Bring your own Claude / OpenAI key when you want the real thing.

---

## Production

**Live:** https://web-kh4qi9w7n-epic-tech-ai-projects.vercel.app

**Repo:** https://github.com/Sm0k367/epic-iron-jarvis

**Desktop app** (recommended): Download the installer from Releases.

---

## Architecture

```
Dashboard (Next.js + Workflow Canvas + Voice)
         ↓
Supervisor + Permission Engine
         ↓
Specialist Agents: Mythos Core | Omnimedia Swarm | Browser | Maintainer | Economy
         ↓
Git Review | LTM | MCP | Vault | Workflows | Self-Healing | Edge Runtime
```

---

## 1000x Vision (already in progress)

- Real Agent Economy with Stripe payments
- Self-evolving platform that improves itself daily
- Multimodal God-Mode (video, 3D, live collaboration)
- Planetary-scale orchestration
- Enterprise SSO + compliance
- Global edge + P2P runtime
- Full developer platform + marketplace

---

## Installation

### Desktop App (Windows – zero dependencies)

Download the latest `Iron Jarvis Setup.exe` from Releases.

### From Source

```bash
git clone https://github.com/Sm0k367/epic-iron-jarvis
cd epic-iron-jarvis
uv sync --extra dev
cd dashboard && pnpm install && pnpm build
uv run ironjarvis up
```

---

**Iron Jarvis** — the AI operating system you actually own.

Built with Claude Code.
