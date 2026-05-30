# Klyxe

### *Your Open Source AI Command Center*

> **Free AI models. Real benchmarks. Zero gatekeeping.**  
> The open source portal for people who refuse to pay $20/month for intelligence.

[![Vercel](https://img.shields.io/badge/deployed%20on-Vercel-000?style=flat-square&logo=vercel)](https://klyxe.ai.vercel.app/)
[![Next.js](https://img.shields.io/badge/Next.js-14-000?style=flat-square&logo=next.js)](https://nextjs.org)
[![FastAPI](https://img.shields.io/badge/API-FastAPI-009688?style=flat-square&logo=fastapi)](https://fastapi.tiangolo.com)
[![Railway](https://img.shields.io/badge/deployed%20on-Railway-0B0D0E?style=flat-square&logo=railway)](https://railway.app)
[![License](https://img.shields.io/badge/license-MIT-blue?style=flat-square)](LICENSE)

---

## Architecture

```
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│   Vercel     │    │   Railway    │    │    Neon      │
│  (Frontend)  │───▶│  (Backend)   │───▶│ (PostgreSQL) │
│  Next.js 14  │    │  FastAPI     │    │  + pgvector  │
│  App Router  │    │  /chat, /auth│    │              │
└──────────────┘    └──────────────┘    └──────────────┘
```

- **17 static pages** via Next.js App Router (SEO: OG, Twitter, sitemap, JSON-LD)
- **15 legacy HTML pages** served via rewrites during migration
- **RAG chat backend** with PostgreSQL + pgvector embeddings
- **Daily benchmark** pipeline (Python) tests 50+ models across 6 providers

## Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | Next.js 14 (App Router), TypeScript, CSS custom properties |
| Backend | FastAPI, SQLAlchemy, pgvector, JWT auth |
| Database | PostgreSQL via Neon, Alembic migrations |
| CI/CD | GitHub Actions, Vercel auto-deploy, Railway auto-deploy |
| Security | CSP headers, rate limiting (120 req/min), DOMPurify, AST sandbox |
| Monitoring | Health endpoint, structured error responses |

## Quick Start

```bash
# Prerequisites: Node 20+, Python 3.12+, Docker

# 1. Start database
docker compose up -d

# 2. Run migrations
cd backend && alembic upgrade head && cd ..

# 3. Start frontend
npm install
npm run dev        # → http://localhost:3000

# 4. Start backend (separate terminal)
cd backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload  # → http://localhost:8000
```

## Environment Variables

### Frontend (`/app`, `.env.local`)
| Variable | Required | Default |
|----------|----------|---------|
| `NEXT_PUBLIC_SITE_URL` | Yes | `https://klyxe.ai` |
| `NEXT_PUBLIC_GOOGLE_VERIFICATION` | No | — |

### Backend (`/backend`, `.env`)
| Variable | Required | Default |
|----------|----------|---------|
| `DATABASE_URL` | Yes | — |
| `JWT_SECRET` | Yes | — |
| `ENVIRONMENT` | No | `development` |
| `FRONTEND_ORIGIN` | No | `http://localhost:5173` |
| `LLM_API_KEY` | No | — |
| `LLM_API_BASE` | No | `https://openrouter.ai/api/v1` |
| `LLM_DEFAULT_MODEL` | No | `openai/gpt-4o-mini` |

## What You Get

### Discover — Don't Guess
Daily benchmarks of **50+ models** across Groq, OpenRouter, Cerebras, Together AI, Google, and SambaNova. Real code execution, not marketing fluff.

- **Quality Score** (0–100) — code, reasoning, instruction, translation
- **Speed Metrics** — tokens per second, ranked within size tiers
- **Fair Tiers** — Small (≤10B), Medium (11–50B), Large (>50B)

### Chat — All Models, One Window
Access models from every major provider in one clean interface. Your API key stays in your browser. No account needed.

### Compare — Let Them Fight
Side-by-side playground. Prompt 2–4 models simultaneously. Spot hidden gems among small open source models.

### Experiment — Full Control
The Lab lets you tweak system prompts, temperature, max tokens. Find what actually works.

## Deploy

See [CLAUDE.md](./CLAUDE.md) for full deployment guide.

```bash
# Vercel (frontend)
# Connect repo → framework: Next.js → build: node build-config.js && next build

# Railway (backend)
# Deploy /backend directory → set env vars → run: alembic upgrade head

# Neon (database)
# Create Postgres + pgvector → copy DATABASE_URL to Railway
```

## Project Structure

```
├── app/                  # Next.js App Router (17 pages)
│   ├── about/            # Static content, no JS deps
│   ├── chat/             # RAG chat interface (loads legacy JS)
│   ├── model/            # Model detail page
│   ├── playground/       # Side-by-side model comparison
│   ├── rankings/         # Leaderboard (loads legacy JS)
│   ├── components/       # Shared React components (Sidebar)
│   ├── sitemap.ts        # Dynamic sitemap
│   └── robots.ts         # Robots.txt
├── backend/              # FastAPI backend (deployable to Railway)
│   ├── app/              # Python application code
│   ├── alembic/          # Database migrations
│   └── Dockerfile        # Container build
├── public/               # Static assets + legacy HTML/JS
│   ├── data/             # Daily benchmark results (JSON)
│   ├── backend/          # Legacy backend reference (deprecated)
│   └── media/            # Images, favicon
├── src/                  # Benchmark engine (Python CLI)
│   ├── benchmark.py      # Test runner + reporting
│   └── config.py         # Model definitions, test suites
├── docker-compose.yml    # Local dev environment
└── vercel.json           # Vercel routing + rewrites
```

## Security

| Fix | Status |
|-----|--------|
| RCE prevention in benchmark.py (AST sandbox) | ✅ |
| Hardcoded secrets removed (env-only) | ✅ |
| XSS protection (DOMPurify + CSP) | ✅ |
| SSRF guard (private IP blocking) | ✅ |
| JWT auth on all API routes | ✅ |
| API key migration to sessionStorage | ✅ |
| Rate limiting (120 req/min per IP) | ✅ |
| Security headers (nosniff, deny framing, strict CSP) | ✅ |

## License

MIT — use it, fork it, ship it.

---

<p align="center">
  <a href="https://klyxe.ai">klyxe.ai</a> ·
  <a href="https://klyxe.ai/chat">💬 Chat</a> ·
  <a href="https://klyxe.ai/playground">⚔️ Playground</a> ·
  <a href="https://klyxe.ai/trends">📈 Trends</a> ·
  <a href="https://github.com/SkillichSE/Klyxe">⭐ Star on GitHub</a>
</p>
