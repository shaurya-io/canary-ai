-- Census Database Schema
-- Run this in your Supabase SQL Editor

-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- Users table (extends Supabase auth.users)
create table public.users (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.users enable row level security;

-- Users policies
create policy "Users can view own profile" on public.users
  for select using (auth.uid() = id);

create policy "Users can update own profile" on public.users
  for update using (auth.uid() = id);

-- Interviews table
create table public.interviews (
  id uuid default uuid_generate_v4() primary key,
  author_id uuid references public.users on delete cascade not null,
  title text not null,
  goal text not null,
  guidelines text,
  time_limit_minutes integer not null default 15,
  agentic_mode boolean not null default true,
  anchor_topics jsonb not null default '[]'::jsonb,
  context_bucket jsonb not null default '{"text": "", "files": []}'::jsonb,
  questions jsonb not null default '[]'::jsonb,
  custom_summary_template text,
  status text not null default 'draft' check (status in ('draft', 'published')),
  url_token text unique not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  published_at timestamp with time zone
);

-- Enable RLS
alter table public.interviews enable row level security;

-- Interviews policies
create policy "Authors can view own interviews" on public.interviews
  for select using (auth.uid() = author_id);

create policy "Authors can create interviews" on public.interviews
  for insert with check (auth.uid() = author_id);

create policy "Authors can update own interviews" on public.interviews
  for update using (auth.uid() = author_id);

create policy "Authors can delete own interviews" on public.interviews
  for delete using (auth.uid() = author_id);

create policy "Anyone can view published interviews by token" on public.interviews
  for select using (status = 'published');

-- Index for URL token lookup
create index interviews_url_token_idx on public.interviews (url_token);
create index interviews_author_id_idx on public.interviews (author_id);

-- Participants table
create table public.participants (
  id uuid default uuid_generate_v4() primary key,
  interview_id uuid references public.interviews on delete cascade not null,
  email text not null,
  magic_link_token text unique not null,
  session_id text,
  status text not null default 'in_progress' check (status in ('in_progress', 'completed')),
  started_at timestamp with time zone default timezone('utc'::text, now()) not null,
  completed_at timestamp with time zone
);

-- Enable RLS
alter table public.participants enable row level security;

-- Participants policies
create policy "Authors can view participants of own interviews" on public.participants
  for select using (
    exists (
      select 1 from public.interviews
      where interviews.id = participants.interview_id
      and interviews.author_id = auth.uid()
    )
  );

create policy "Anyone can create participant for published interview" on public.participants
  for insert with check (
    exists (
      select 1 from public.interviews
      where interviews.id = interview_id
      and interviews.status = 'published'
    )
  );

create policy "Participants can update own record by token" on public.participants
  for update using (true);

create policy "Anyone can view participant by magic link token" on public.participants
  for select using (true);

-- Index for magic link lookup
create index participants_magic_link_token_idx on public.participants (magic_link_token);
create index participants_interview_id_idx on public.participants (interview_id);

-- Transcripts table
create table public.transcripts (
  id uuid default uuid_generate_v4() primary key,
  participant_id uuid references public.participants on delete cascade not null unique,
  messages jsonb not null default '[]'::jsonb,
  sentiment_scores jsonb not null default '[]'::jsonb
);

-- Enable RLS
alter table public.transcripts enable row level security;

-- Transcripts policies
create policy "Authors can view transcripts of own interviews" on public.transcripts
  for select using (
    exists (
      select 1 from public.participants p
      join public.interviews i on i.id = p.interview_id
      where p.id = transcripts.participant_id
      and i.author_id = auth.uid()
    )
  );

create policy "Anyone can create/update transcript" on public.transcripts
  for all using (true);

-- Index for participant lookup
create index transcripts_participant_id_idx on public.transcripts (participant_id);

-- Summaries table
create table public.summaries (
  id uuid default uuid_generate_v4() primary key,
  participant_id uuid references public.participants on delete cascade not null unique,
  free_form_insights text not null,
  key_themes jsonb not null default '[]'::jsonb,
  notable_quotes jsonb not null default '[]'::jsonb,
  participant_sentiment text not null,
  actionable_insights jsonb not null default '[]'::jsonb,
  generated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.summaries enable row level security;

-- Summaries policies
create policy "Authors can view summaries of own interviews" on public.summaries
  for select using (
    exists (
      select 1 from public.participants p
      join public.interviews i on i.id = p.interview_id
      where p.id = summaries.participant_id
      and i.author_id = auth.uid()
    )
  );

create policy "Anyone can create/update summary" on public.summaries
  for all using (true);

-- Index for participant lookup
create index summaries_participant_id_idx on public.summaries (participant_id);

-- Analytics cache table
create table public.analytics_cache (
  id uuid default uuid_generate_v4() primary key,
  interview_id uuid references public.interviews on delete cascade not null unique,
  aggregate_themes jsonb not null default '[]'::jsonb,
  sentiment_trends jsonb not null default '[]'::jsonb,
  last_updated timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.analytics_cache enable row level security;

-- Analytics cache policies
create policy "Authors can view analytics of own interviews" on public.analytics_cache
  for select using (
    exists (
      select 1 from public.interviews
      where interviews.id = analytics_cache.interview_id
      and interviews.author_id = auth.uid()
    )
  );

create policy "Anyone can create/update analytics cache" on public.analytics_cache
  for all using (true);

-- Index for interview lookup
create index analytics_cache_interview_id_idx on public.analytics_cache (interview_id);

-- Function to auto-create user profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

-- Trigger for new user signup
create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Function to update interview's published_at when status changes
create or replace function public.handle_interview_publish()
returns trigger as $$
begin
  if new.status = 'published' and old.status = 'draft' then
    new.published_at = timezone('utc'::text, now());
  end if;
  return new;
end;
$$ language plpgsql;

-- Trigger for interview publish
create or replace trigger on_interview_publish
  before update on public.interviews
  for each row execute procedure public.handle_interview_publish();
