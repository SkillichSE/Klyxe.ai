# Klyxe.ai

### *Your Open Source AI Command Center*

> **Free AI models. Real benchmarks. Zero gatekeeping.**  
> The open source portal for people who refuse to pay $20/month for intelligence.

[![Enter Klyxe](https://img.shields.io/badge/Enter%20Klyxe-6366f1?style=for-the-badge&logo=google-chrome&logoColor=white)](https://klyxe-ai.vercel.app/)

---

## What You Get

### Discover — Don't Guess
Not sure which model to use? We benchmark **50+ models daily** — from Llama and Mistral to Gemini and Qwen. Real code execution, no marketing fluff.

- **Quality Score** (0–100) — code, reasoning, instruction, translation
- **Speed Metrics** — tokens per second, ranked separately by size tier
- **Tiered Competition** — Small (≤10B), Medium (11–50B), Large (>50B) compete within their class

### Chat — All Models, One Window
Stop juggling browser tabs. Access models from OpenRouter, Groq, Google, Cerebras, SambaNova, and more — dozens of free-tier models, both open source and commercial — in one clean interface with RAG support.

Your API key stays in your browser. No account needed. No data harvesting.

### Compare — Let Them Fight
The [Playground](https://klyxe-ai.vercel.app/playground) lets you prompt multiple models simultaneously. Watch AIs compete for the best answer. Perfect for finding hidden gems among smaller open source models.

### Experiment — Full Control
The [Lab](https://klyxe-ai.vercel.app/lab) is your sandbox. Tweak system prompts, temperature, max tokens. Test what actually works for your use case, not what vendors claim.

### Stay Ahead — News & Trends
Track which open source models are rising. Get AI industry updates without the hype. Spot tomorrow's champions while others read press releases.

---

## Our Open Source Promise

| Big Tech | Klyxe |
|----------|-------|
| $20/month subscriptions | **100% free to use** |
| Black-box models | **Open source weights** |
| Vendor lock-in | **Your API key, your control** |
| Marketing benchmarks | **Real code execution** |
| Proprietary scoring | **Fully transparent tests** |

We don't sell AI. We don't gatekeep it. We just help you find the best open source models that rival the paid ones.

---

## Get Started in 30 Seconds

### Just Look (Zero Setup)
[**Open Klyxe →**](https://klyxe-ai.vercel.app/)  
No signup. No cookies. No "create account to view". Just data.

### Chat Like a Pro (2 Minutes)
1. Get a free API key from [OpenRouter](https://openrouter.ai/) (or Groq, Google, etc.)
2. Open [Klyxe Chat](https://klyxe-ai.vercel.app/chat)
3. Paste your key — it stays in your browser, never our servers
4. Start talking to any model

### Make Them Compete
1. Go to [Playground](https://klyxe-ai.vercel.app/playground)
2. Pick 2–4 models from the sidebar
3. Type your prompt
4. See all responses at once

---

## What's Under the Hood

| Test | What We Check | Why It Matters |
|------|---------------|----------------|
| **Code** | Python functions run against test cases | Real coding ability, not just syntax |
| **Reasoning** | Logic puzzles with known answers | Multi-step thinking, not pattern matching |
| **Instructions** | Exact format compliance | Following specs without hand-holding |
| **Translation** | EN↔RU, EN↔ES accuracy | Working with non-English content |
| **Speed** | Tokens per second | Latency for real-time applications |

### Tech Stack

| Layer | What We Use |
|-------|-------------|
| Frontend | Next.js 14 (App Router), TypeScript, static generation |
| Backend | FastAPI, PostgreSQL + pgvector, JWT auth |
| Benchmarks | Python, subprocess sandbox, 6 API providers |
| Hosting | Vercel (frontend) + Railway (backend) + Neon (database) |
| Security | CSP headers, rate limiting, DOMPurify, AST sandbox |

---

## Who It's For

- **Developers** — Ship faster with capable open source coding models (free)
- **Bootstrappers** — Run AI features without burning runway on API bills
- **Students** — Access GPT-4 class intelligence without a credit card
- **Privacy Hawks** — Self-hostable, no data sent to us, ever
- **AI Rebels** — Believe intelligence should be open, not walled gardens

---

## FAQ

**Q: Is it really free?**  
A: Yes. The rankings are free to view. Chat requires your own API key from providers (many offer generous free tiers).

**Q: Do you sell my data?**  
A: No. API keys stay in your browser. We don't track, store, or sell anything.

**Q: How often are rankings updated?**  
A: Every 24 hours via automated testing.

**Q: Can I suggest a model to test?**  
A: Open an issue on GitHub — we add popular free models regularly.

**Q: Why isn't [Paid Model] here?**  
A: We focus on free tiers. If it has a free API or trial, it's eligible.

---

## Stay Updated

- [**News**](https://klyxe-ai.vercel.app/news) — AI industry updates, new models, provider changes
- [**Trends**](https://klyxe-ai.vercel.app/trends) — See scores evolve over time

---

## The Klyxe Manifesto

AI shouldn't cost $20/month. Intelligence is becoming a commodity, not a luxury product.

Klyxe is **100% open source**. Every benchmark, every line of code, every score is public. No investors to please. No vendors to appease. No "partnership" bias.

If we messed up a test — you'll see it. If you think our weights are wrong — change them. This is a community tool for people who believe **AI access is a right, not a privilege**.

---

<p align="center">
  <a href="https://klyxe-ai.vercel.app/">
    <img src="https://img.shields.io/badge/Start%20Testing%20Now-8b5cf6?style=for-the-badge&logo=rocket&logoColor=white" alt="Start Testing Now">
  </a>
</p>

<p align="center">
  <a href="https://klyxe-ai.vercel.app/chat">💬 Chat</a> ·
  <a href="https://klyxe-ai.vercel.app/playground">⚔️ Playground</a> ·
  <a href="https://klyxe-ai.vercel.app/trends">📈 Trends</a> ·
  <a href="https://github.com/SkillichSE/Klyxe">⭐ Star on GitHub</a>
</p>

<p align="center"><i>Open source intelligence for open minds.</i></p>

---

## Local Development

```bash
# Frontend
npm install
npm run dev        # http://localhost:3000

# Backend + database
docker compose up -d
cd backend && pip install -r requirements.txt
uvicorn app.main:app --reload  # http://localhost:8000

# Database migrations
cd backend && alembic upgrade head
```

Built with [Next.js](https://nextjs.org), [FastAPI](https://fastapi.tiangolo.com), [PostgreSQL + pgvector](https://github.com/pgvector/pgvector). Deployed on [Vercel](https://vercel.com) + [Railway](https://railway.app).
