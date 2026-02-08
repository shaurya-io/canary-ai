# Canary

AI-powered interview platform that enables product teams to conduct intelligent, adaptive user interviews at scale. Uses Claude AI to ask follow-up questions, dig deeper on interesting responses, and generate insights automatically.

## Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19
- **Backend**: TypeScript/Node.js API routes
- **Database**: Supabase (PostgreSQL + Auth + RLS)
- **AI**: Claude Sonnet 4 via Anthropic SDK
- **Styling**: Tailwind CSS 4

## Getting Started

```bash
npm install
npm run dev
```

The app runs at [http://localhost:3000](http://localhost:3000).

### Environment Variables

Create a `.env.local` file (see `.env.local.example`):

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
ANTHROPIC_API_KEY=
```

Optional:
```
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_APP_URL=
```

### Database Setup

Run `supabase/schema.sql` in your Supabase SQL Editor to create tables, RLS policies, and triggers.

## Features

- **Interview Creation** — Three-phase plan mode: define goals, AI generates categorized questions, drag-drop editing
- **Agentic Mode** — AI dynamically generates follow-up questions based on participant responses, ensures must-cover topics are addressed, paces to time limit
- **Scripted Mode** — Fixed question order, no dynamic follow-ups
- **Edit & Duplicate** — Edit all fields after creation (any status), clone interviews as templates
- **Participant Experience** — Shareable links, magic link auth, one question at a time, AI suggestions, session persistence
- **Analytics** — Per-participant summaries (30-40 word bulleted format), key themes, sentiment, notable quotes, actionable insights
- **Export** — Transcripts in TXT, DOCX, PDF (without AI reasoning traces)

## Scripts

```bash
npm run dev      # Development server
npm run build    # Production build
npm run start    # Production server
npm run lint     # ESLint
```
