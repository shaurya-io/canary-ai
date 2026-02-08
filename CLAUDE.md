# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Census is an agentic text-based interview tool for product teams. Authors create adaptive interviews; participants complete them via shareable links. Built with Next.js 16 App Router, Supabase, and Claude Sonnet 4.

## Commands

```bash
npm run dev      # Start dev server (localhost:3000)
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Architecture

### Route Structure

The app uses Next.js App Router with route groups for layout isolation:

- `(auth)/` — Login, join pages. Layout forces `dynamic = 'force-dynamic'` for SSR auth.
- `(dashboard)/` — Protected author routes. Layout checks auth via `createClient()` and redirects unauthenticated users. Contains `DashboardNav`.
- `interview/[token]/` — Public participant experience (no auth group).
- `api/agent/` — Three POST-only API routes for AI operations.
- `auth/callback/` — OAuth code exchange handler.
- Root `page.tsx` — Marketing landing page (not behind auth).

### Auth & Middleware

Middleware (`middleware.ts` → `src/lib/supabase/middleware.ts`) runs on all non-static routes:
- Refreshes Supabase auth token via `getUser()`
- `/dashboard/*` and `/interviews/*` → redirect to `/login` if unauthenticated
- `/login` → redirect to `/dashboard` if already authenticated

Participants authenticate via magic link tokens (email-scoped, no password), not Supabase Auth.

### Supabase Client Pattern

Two client factories, both use `@supabase/ssr` with cookie-based sessions:
- `src/lib/supabase/server.ts` — `createClient()` for Server Components and API routes (uses `cookies()` from `next/headers`)
- `src/lib/supabase/client.ts` — `createBrowserClient()` for Client Components

The server client silently catches `setAll` errors in Server Components (middleware handles session refresh).

### API Routes

All three routes are POST-only, located in `src/app/api/agent/`:

| Route | Purpose | Key Detail |
|-------|---------|------------|
| `generate-questions` | Creates categorized questions from interview config | Returns 6-9 questions (agentic) or 9-12 (static) |
| `interview-response` | Generates follow-up questions during live interview | Paces to time limit, ensures anchor topic coverage |
| `generate-summary` | Post-interview analysis | Uses `SUPABASE_SERVICE_ROLE_KEY` if available for elevated access |

All use `claude-sonnet-4-20250514` model. Responses are non-streaming — thinking animations bridge the wait.

### Component Patterns

- Pages in `(dashboard)/` are Server Components (fetch data, check auth)
- Interactive UIs use `'use client'` — interview experience, forms, drag-drop editor
- No SSE/streaming: full responses displayed when ready
- `ThemeProvider` in `src/lib/theme-provider.tsx` manages dark/light mode via localStorage (key: `census-theme`)

### Key Types

All types in `src/types/index.ts`. Core entities:
- `Interview` — has `questions: Question[]`, `status: 'draft' | 'published'`, `url_token`
- `Question` — `text`, `category`, `order`, `isAIMultipleChoice?`
- `Participant` — `status: 'in_progress' | 'completed' | 'incomplete'`, `magic_link_token`
- `Message` — `role: 'agent' | 'participant'`, optional `thinking`
- `AgentInterviewResponse` — `thinking?`, `question?`, `complete`, `suggestions?`, `responseSummary?`

### Styling

Tailwind CSS 4 via `@tailwindcss/postcss` (no `tailwind.config` file). Design system defined in `globals.css`:
- CSS custom properties for theming (light/dark)
- Primary accent: orange `#F97316`
- Three font families: Inter (sans), Newsreader (serif headings), Geist Mono (mono)
- Custom animations: `fadeInUp`, `slideIn`, `pulse-glow`, `blink`

## Database

Schema in `supabase/schema.sql`. Tables: `users`, `interviews`, `participants`, `transcripts`, `summaries`, `analytics_cache`. RLS policies enforce author/participant isolation. Key JSONB columns: `interviews.questions`, `transcripts.messages`.

## Environment Variables

Required: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `ANTHROPIC_API_KEY`
Optional: `SUPABASE_SERVICE_ROLE_KEY` (elevated access in generate-summary), `NEXT_PUBLIC_APP_URL`

## Path Alias

`@/*` → `./src/*`

## Testing

Playwright MCP is available for browser testing. Use it to verify changes work as intended. Test credentials: `test@shaurya.io` / `Shaurya@123`.
