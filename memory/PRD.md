# SevaPath — PRD

## Product
SevaPath — a citizen-service platform that turns a citizen's real-world goal into
a verified, state-aware, step-by-step government-service journey.

Promise: "Tell SevaPath what you're trying to get done."

SevaPath is a **guide**, not the government.

## Architecture (as built)
- **Frontend**: React (CRA) with Tailwind + shadcn/ui, React Router v7, framer-motion
- **Backend**: FastAPI + MongoDB (Motor) with strict `/api` prefix
- **AI**: `emergentintegrations.llm.chat` via `EMERGENT_LLM_KEY` — Gemini primary, OpenAI fallback, single `AIProvider` abstraction
- **Voice**: Web Speech API (STT), no TTS in v1
- **Persistence**: `localStorage` for journeys and settings — no auth in v1
- **i18n**: EN / HI / TA via `LanguageContext`; language switcher lives only in the Header

## User personas
1. First-time citizen who doesn't know bureaucratic terms — describes the goal in plain words
2. Time-strapped applicant who wants a step-by-step checklist
3. Accessibility-conscious user needing reduced motion, larger text, keyboard nav

## Core requirements (satisfied)
- Homepage is goal-first (input + voice + "I'm not sure" + life situations)
- Deterministic 6-stage journey: Understand → Confirm → Eligibility → Documents → Procedure → Application
- Deterministic eligibility engine (backend), AI never overrides it
- Application URLs come only from verified service records; SevaPath never fabricates them
- TEST_ONLY fixtures are clearly labelled and never promoted to production catalogue
- One global Copilot with intent → retrieval → clarification → guidance in a single orchestrated call
- Prompt-injection resistant system prompt; treat user text as untrusted
- Document upload UI (drag/drop, camera, preview, remove, replace) — session-only, never auto-sent to AI
- Trust badges (Verified / AI Guidance / Not Verified) + "Why am I seeing this?" popover
- MySevaPath local workspace with progress, resume, delete, clear-all
- Settings: theme, text-size (rem scaling), reduce motion, clear data — NO language selector here
- WCAG 2.1 AA leaning: skip link, 44/48px targets, focus rings, aria-live, semantic HTML

## What's implemented (2026-02-26)
- Backend endpoints: `/api/`, `/api/health`, `/api/services`, `/api/services/search`,
  `/api/services/{id}`, `/api/services/eligibility`, `/api/copilot`
- Service schema (Pydantic) + TEST_ONLY registry (3 fixtures: learner's licence, scholarship, address update)
- Deterministic eligibility engine with structured verdict
- Copilot pipeline: retrieval (keyword + alias + life-situation) + Gemini→OpenAI fallback
- Frontend routes: `/`, `/discover`, `/journey/:id`, `/my`, `/settings`, `/about`
- All stages implemented, journey tracker is deterministic (never scroll-driven)
- EN/HI/TA translations for the primary UI surfaces

## Prioritised backlog
- P1: real verified content pipeline (currently only TEST_ONLY fixtures)
- P1: streaming Copilot responses (SSE) — current version uses one-shot for simplicity
- P1: text-to-speech readback (opt-in) for accessibility
- P2: Playwright end-to-end test harness
- P2: PWA manifest + offline shell
- P2: Cloud sync for MySevaPath (opt-in)

## Human verification items
- All service content in the app is TEST_ONLY fixtures — no real government data
- Language coverage for HI / TA is limited to primary UI strings; the deeper journey copy still falls back to English keys where translations were not authored
