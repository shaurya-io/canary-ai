# Canary - Product Specification

**Version:** 1.5
**Last Updated:** January 6, 2026

## Overview

Canary is an AI-powered interview tool that enables product teams to conduct intelligent, adaptive user interviews at scale. The platform uses Claude AI to ask follow-up questions, dig deeper on interesting responses, and generate insights automatically.

---

## Core Features

### 1. Interview Creation

Authors can create interviews with the following configuration options:

| Field | Description | Required |
|-------|-------------|----------|
| Title | Name of the interview | Yes |
| Goal | Research objective description | Yes |
| Guidelines | Natural language instructions for AI follow-ups | No |
| Time Limit | 5-60 minutes (default: 15) | Yes |
| Agentic Mode | Enable AI-powered adaptive follow-ups | Yes (default: on) |
| Must-Cover Topics | Topics AI must address regardless of conversation flow | No |
| Context | Background information to help AI craft better questions | No |
| Custom Summary Template | Specific questions for AI to answer in summaries | No |

**Question Generation:**
- AI generates categorized questions based on the interview goal
- Questions grouped by theme (e.g., "Performance Overview", "Technical Skills")
- Each question can have "AI Multiple Choice" enabled for response suggestions
- Full drag-and-drop reordering support
- Add/edit/delete questions manually

### 2. Interview Modes

**Agentic Mode (Default)**
- AI dynamically generates follow-up questions based on participant responses
- Probes deeper on interesting or vague answers
- Ensures must-cover topics are addressed
- Paces interview to fit time limit

**Scripted Mode**
- Questions asked in fixed order
- No dynamic follow-ups
- Predictable interview structure

### 3. Interview Management

**Edit Interview**
- Edit ALL fields after creation (both draft and published)
- Option to "Edit Questions Only" without regenerating
- Option to "Regenerate Questions" with updated settings
- Published interviews show "Update Interview" button
- Draft interviews show both "Save as Draft" and "Publish" options

**Duplicate Interview**
- Clone any interview as a template
- Creates new interview with "(Copy)" suffix
- Always starts as draft status
- Copies all settings: goal, guidelines, questions, time limit, etc.
- Generates new unique URL token

**Interview States**
- Draft: Editable, not shareable
- Published: Shareable via unique URL, still editable

### 4. Participant Experience

**Interview Flow:**
1. Participant receives shareable link
2. Enters email to start
3. Questions presented one at a time
4. AI generates response suggestions (if enabled)
5. AI asks follow-up questions (in agentic mode)
6. AI reasoning/thinking traces visible to participant during interview (for transparency)
7. Progress indicator shows time remaining
8. Category summaries between question groups
9. Thank you screen on completion

**Input Interface:**
- Modern chat-style input
- Full-width text area
- Enter to send, Shift+Enter for newline
- Send button integrated in input area

### 5. Analytics & Insights

**Per-Participant Summary:**
- Key highlights (30-40 word bulleted format)
- Key themes identified
- Notable quotes with context
- Participant sentiment analysis
- Actionable insights

**Aggregate Analytics:**
- Theme frequency across participants
- Sentiment trends over time
- Response patterns

### 6. Transcript & Export

**Transcript Display (Author Dashboard):**
- Full conversation history
- Role labels: "Canary" (AI) and "Participant"
- Clean display without internal reasoning traces (hidden from author view)
- Note: Reasoning traces ARE visible to participants during the live interview for transparency, but hidden from author-facing transcript views

**Export Formats:**
- TXT: Plain text transcript
- DOCX: Formatted Word document
- PDF: Printable format

All exports exclude internal AI reasoning/thinking traces.

---

## Technical Architecture

### Tech Stack
- **Frontend:** Next.js 16 (App Router), React 19
- **Backend:** TypeScript/Node.js
- **Database:** Supabase (PostgreSQL + Auth + Realtime)
- **AI:** Claude API (claude-sonnet-4-20250514)
- **Styling:** Tailwind CSS 4

### Data Model

```
users
  - id (uuid, PK)
  - email (text)
  - created_at (timestamp)

interviews
  - id (uuid, PK)
  - author_id (uuid, FK -> users)
  - title (text)
  - goal (text)
  - guidelines (text)
  - time_limit_minutes (int)
  - agentic_mode (boolean)
  - anchor_topics (jsonb)
  - context_bucket (jsonb)
  - questions (jsonb)
  - custom_summary_template (text)
  - status ('draft' | 'published')
  - url_token (text, unique)
  - created_at (timestamp)
  - published_at (timestamp)

participants
  - id (uuid, PK)
  - interview_id (uuid, FK -> interviews)
  - email (text)
  - magic_link_token (text, unique)
  - session_id (text)
  - status ('in_progress' | 'completed')
  - started_at (timestamp)
  - completed_at (timestamp)

transcripts
  - id (uuid, PK)
  - participant_id (uuid, FK -> participants)
  - messages (jsonb)
  - sentiment_scores (jsonb)

summaries
  - id (uuid, PK)
  - participant_id (uuid, FK -> participants)
  - free_form_insights (text)
  - key_themes (jsonb)
  - notable_quotes (jsonb)
  - participant_sentiment (text)
  - actionable_insights (jsonb)
  - generated_at (timestamp)

analytics_cache
  - id (uuid, PK)
  - interview_id (uuid, FK -> interviews)
  - aggregate_themes (jsonb)
  - sentiment_trends (jsonb)
  - last_updated (timestamp)
```

### API Routes

| Route | Method | Description |
|-------|--------|-------------|
| `/api/agent/generate-questions` | POST | Generate interview questions |
| `/api/agent/interview-response` | POST | Process participant response |
| `/api/agent/generate-summary` | POST | Generate participant summary |
| `/auth/callback` | GET | Supabase auth callback |

---

## User Roles

### Authors (Authenticated Users)
- Create, edit, duplicate interviews
- View all their interviews on dashboard
- Access participant transcripts and summaries
- Export data in multiple formats
- View aggregate analytics

### Participants (Public)
- Access interviews via shareable URL
- No account required
- Email captured for identification
- Session-based access to their interview

---

## UI/UX

### Theme
- Dark terminal-like aesthetic
- Emerald accent color
- Light/Dark mode toggle
- Theme preference persisted in localStorage

### Navigation
- Dashboard: Interview list with stats
- Interview Detail: Full interview view with actions
- Edit/New: Multi-step interview configuration
- Participant View: Clean chat interface
- Settings: Theme preferences

---

## Security

- Row Level Security (RLS) on all Supabase tables
- Authors can only access their own interviews
- Published interviews publicly viewable by URL token
- Participant data scoped to their session

---

## Version History

### v1.5 (January 2026)
- Edit interview feature (all fields, any status)
- Duplicate interview feature
- Shorter bulleted summary format (30-40 words)
- Reasoning traces removed from transcript display and exports
- Redesigned participant input interface

### v1.4 (January 2026)
- AI Multiple Choice suggestions for participants
- Category summaries between question groups
- Smart suggestions feature

### v1.0 (Initial Release)
- Core interview creation and participation
- Agentic mode with dynamic follow-ups
- Basic analytics and exports
