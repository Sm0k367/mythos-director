# Mythos Director

**AI Campaign Production Studio**

Mythos Director turns marketing briefs into production-ready campaign packages. Marketing teams, agencies, and founders use it to go from product + audience + goal to creative direction, storyboards, hero images, and platform copy — in minutes instead of days.

---

## Real-world use case

**Problem:** Small marketing teams spend days in kickoff meetings, creative briefs, and first-draft production before anything is reviewable.

**Solution:** Submit a brief → Mythos Director runs a live production pipeline → export a JSON package your design and media teams can execute on.

### What each campaign produces

| Deliverable | Description |
|-------------|-------------|
| Creative direction | Concept, 3 taglines, messaging pillars, color palette |
| Storyboard | 4-shot board with durations and visual prompts |
| Voiceover script | 15-second commercial script |
| Hero image | Generated visual (Stable Diffusion XL when `HF_TOKEN` is set) |
| Social copy | Headline, Instagram, LinkedIn, X, and CTA — ready to publish |
| Export | Full campaign package as downloadable JSON |

---

## Architecture

```
Marketing Brief
      ↓
Campaign Pipeline (SSE stream)
  1. Brief analysis
  2. Creative direction      ← OpenAI gpt-4o-mini
  3. Storyboard + script     ← OpenAI gpt-4o-mini
  4. Hero image              ← Hugging Face SDXL (optional)
  5. Social copy             ← OpenAI gpt-4o-mini
  6. Human review + export
      ↓
Campaign Package (JSON)
```

Built on Next.js 16 with serverless API routes. No database required for MVP — campaigns are stored in-memory per server instance (swap for Postgres/Redis in production).

---

## Quick start

```bash
git clone https://github.com/Sm0k367/mythos-director
cd mythos-director
cp .env.example apps/web/.env.local
# Add your OPENAI_API_KEY to apps/web/.env.local

cd apps/web
npm install
npm run dev
```

Open http://localhost:3000

### Environment variables

| Variable | Required | Purpose |
|----------|----------|---------|
| `OPENAI_API_KEY` | Recommended | Creative direction, storyboard, copy |
| `HF_TOKEN` | Optional | Real hero image generation |
| `STRIPE_SECRET_KEY` | Optional | Deployment billing (future) |

Without `OPENAI_API_KEY`, the pipeline runs in demo mode with template fallbacks.

---

## Routes

| Path | Description |
|------|-------------|
| `/` | Landing page |
| `/campaigns/new` | Create a campaign brief |
| `/campaigns` | List campaigns |
| `/campaigns/[id]` | Live pipeline + results |
| `/workflows` | Pipeline demo with SSE stream |
| `/api/campaigns` | REST API for campaigns |
| `/api/campaigns/[id]/export` | Download campaign package |

---

## Deploy

```bash
cd apps/web
npm run build
```

Deploy to Vercel with environment variables set in the project dashboard.

---

## Relationship to Iron Jarvis

Mythos Director evolved from the [Iron Jarvis](https://github.com/Sm0k367/epic-iron-jarvis) agent OS vision. This repo focuses on one concrete, shippable product: **AI campaign production for marketing teams**.

The Python packages (`supervisor`, `permissions`, `workflow-engine`) remain as foundation code for future agent orchestration. The production app lives in `apps/web`.

---

Built for marketing teams who need campaigns shipped, not slideware.