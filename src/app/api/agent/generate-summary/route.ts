import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@supabase/supabase-js';

function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    throw new Error('Missing Supabase environment variables');
  }
  return createClient(url, key);
}

function getAnthropicClient() {
  return new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  });
}

interface RequestBody {
  participantId: string;
  interviewId: string;
}

export async function POST(request: Request) {
  try {
    const supabase = getSupabaseClient();
    const anthropic = getAnthropicClient();
    const { participantId, interviewId }: RequestBody = await request.json();

    // Get interview and transcript
    const [interviewResult, transcriptResult] = await Promise.all([
      supabase.from('interviews').select('*').eq('id', interviewId).single(),
      supabase.from('transcripts').select('*').eq('participant_id', participantId).single(),
    ]);

    if (interviewResult.error || !interviewResult.data) {
      throw new Error('Interview not found');
    }

    if (transcriptResult.error || !transcriptResult.data) {
      throw new Error('Transcript not found');
    }

    const interview = interviewResult.data;
    const transcript = transcriptResult.data;

    // Format conversation for analysis
    const conversation = transcript.messages
      .map((m: { role: string; content: string }) =>
        `${m.role === 'agent' ? 'Interviewer' : 'Participant'}: ${m.content}`
      )
      .join('\n\n');

    const systemPrompt = `You are an expert user researcher analyzing an interview transcript. Generate a comprehensive summary.

Interview Goal: ${interview.goal}

${interview.custom_summary_template ? `Custom Analysis Questions:\n${interview.custom_summary_template}` : ''}

Generate the summary in the following JSON format:
{
  "free_form_insights": "A concise 30-40 word bulleted summary with 3-4 key takeaways. Format as bullet points, each starting with '- ' on its own line. Be specific and actionable.",
  "key_themes": ["Theme 1", "Theme 2", ...],
  "notable_quotes": [
    {"text": "Exact quote", "context": "Why this quote is notable"},
    ...
  ],
  "participant_sentiment": "Overall sentiment and attitude of the participant",
  "actionable_insights": ["Insight 1", "Insight 2", ...]
}

Be specific and actionable. Quote the participant directly when possible.`;

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2048,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: `Analyze this interview transcript:\n\n${conversation}\n\nReturn JSON only.`,
        },
      ],
    });

    const textContent = message.content.find(block => block.type === 'text');
    if (!textContent || textContent.type !== 'text') {
      throw new Error('No text response received');
    }

    // Parse JSON response
    const text = textContent.text.trim();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Could not parse summary from response');
    }

    const summary = JSON.parse(jsonMatch[0]);

    // Save summary to database
    await supabase.from('summaries').upsert({
      participant_id: participantId,
      free_form_insights: summary.free_form_insights,
      key_themes: summary.key_themes,
      notable_quotes: summary.notable_quotes,
      participant_sentiment: summary.participant_sentiment,
      actionable_insights: summary.actionable_insights,
      generated_at: new Date().toISOString(),
    });

    // Update analytics cache (incrementally)
    await updateAnalyticsCache(interviewId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Summary generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate summary' },
      { status: 500 }
    );
  }
}

async function updateAnalyticsCache(interviewId: string) {
  const supabase = getSupabaseClient();
  try {
    // Get all summaries for this interview
    const { data: participants } = await supabase
      .from('participants')
      .select('id')
      .eq('interview_id', interviewId)
      .eq('status', 'completed');

    if (!participants || participants.length === 0) return;

    const participantIds = participants.map(p => p.id);

    const { data: summaries } = await supabase
      .from('summaries')
      .select('*')
      .in('participant_id', participantIds);

    if (!summaries || summaries.length === 0) return;

    // Aggregate themes
    const themeCounts: Record<string, number> = {};
    summaries.forEach(s => {
      (s.key_themes || []).forEach((theme: string) => {
        themeCounts[theme] = (themeCounts[theme] || 0) + 1;
      });
    });

    const aggregateThemes = Object.entries(themeCounts)
      .map(([theme, count]) => ({ theme, count }))
      .sort((a, b) => b.count - a.count);

    // Sentiment trends (simple average based on sentiment keywords)
    const sentimentTrends = summaries.map(s => ({
      date: s.generated_at,
      sentiment: s.participant_sentiment,
    }));

    // Upsert analytics cache
    await supabase.from('analytics_cache').upsert({
      interview_id: interviewId,
      aggregate_themes: aggregateThemes,
      sentiment_trends: sentimentTrends,
      last_updated: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Analytics cache update error:', error);
  }
}
