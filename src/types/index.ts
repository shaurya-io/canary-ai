// Database types for Supabase

export interface User {
  id: string;
  email: string;
  created_at: string;
}

export interface Interview {
  id: string;
  author_id: string;
  title: string;
  goal: string;
  guidelines: string | null;
  time_limit_minutes: number;
  agentic_mode: boolean;
  anchor_topics: string[];
  context_bucket: ContextBucket;
  questions: Question[];
  custom_summary_template: string | null;
  status: 'draft' | 'published';
  url_token: string;
  created_at: string;
  published_at: string | null;
}

export interface ContextBucket {
  text: string;
  files: ParsedFile[];
}

export interface ParsedFile {
  name: string;
  type: string;
  content: string;
}

export interface Question {
  id: string;
  text: string;
  order: number;
  category: string;
  isAIMultipleChoice?: boolean; // true = show AI-generated response options (default), false = free-form only
}

export interface Category {
  id: string;
  name: string;
  order: number;
}

export interface Participant {
  id: string;
  interview_id: string;
  email: string;
  magic_link_token: string;
  session_id: string | null;
  status: 'in_progress' | 'completed' | 'incomplete';
  started_at: string;
  completed_at: string | null;
}

export interface Transcript {
  id: string;
  participant_id: string;
  messages: Message[];
  sentiment_scores: SentimentScore[];
}

export interface Message {
  id: string;
  role: 'agent' | 'participant';
  content: string;
  thinking?: string;
  timestamp: string;
}

export interface SentimentScore {
  message_id: string;
  score: number;
  label: 'positive' | 'neutral' | 'negative';
}

export interface Summary {
  id: string;
  participant_id: string;
  free_form_insights: string;
  key_themes: string[];
  notable_quotes: Quote[];
  participant_sentiment: string;
  actionable_insights: string[];
  generated_at: string;
}

export interface Quote {
  text: string;
  context: string;
}

export interface AnalyticsCache {
  id: string;
  interview_id: string;
  aggregate_themes: ThemeCount[];
  sentiment_trends: SentimentTrend[];
  last_updated: string;
}

export interface ThemeCount {
  theme: string;
  count: number;
}

export interface SentimentTrend {
  date: string;
  average_score: number;
}

// API Response types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

// Interview creation form
export interface InterviewFormData {
  title: string;
  goal: string;
  guidelines: string;
  time_limit_minutes: number;
  agentic_mode: boolean;
  anchor_topics: string[];
  context_text: string;
  custom_summary_template: string;
}

// Agent message types for real-time updates
export interface AgentUpdate {
  type: 'thinking' | 'question' | 'complete' | 'error';
  content?: string;
  thinking?: string;
  questions?: Question[];
}

// V1.5: Smart clickable options
export interface SuggestedOption {
  title: string;      // max 7-8 words
  description: string; // max 20 words
}

// V1.5: Agent interview response with suggestions
export interface AgentInterviewResponse {
  thinking?: string;
  question?: string;
  complete: boolean;
  suggestions?: SuggestedOption[];
  responseSummary?: string; // 1-2 line summary of participant's answer
}
