# 📰 PulseWire — AI-Powered News Automation Platform

An intelligent news aggregation and automation platform that collects, processes, and distributes content using AI — across web, CMS, and bot services.

## Features

- **AI Content Processing** — summarizes and categorizes news articles automatically
- **Web Platform** — clean reader interface with category filtering
- **CMS** — editorial dashboard to manage and publish content
- **Bot Service** — automated distribution via Telegram / social channels
- **RSS & Scraping** — aggregates from multiple news sources

## Tech Stack

- **Framework:** Next.js / Node.js
- **Language:** TypeScript
- **AI:** OpenAI API / Custom NLP pipeline
- **Database:** PostgreSQL
- **Styling:** Tailwind CSS
- **Deployment:** Vercel

## Architecture

```
News Sources (RSS/Scraper) → AI Processor → Database → Web + CMS + Bot
```

## Modules

| Module | Description |
|--------|-------------|
| `web`  | Public-facing news reader |
| `cms`  | Admin panel for editors |
| `bot`  | Telegram bot for distribution |

## Setup

```bash
git clone https://github.com/devslotcy/pulsewire
cd pulsewire
npm install
cp .env.example .env.local
npm run dev
```

---

Built by [Mucahit Tiglioglu](https://github.com/devslotcy)
