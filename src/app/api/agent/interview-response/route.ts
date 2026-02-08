import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import type { Interview, Message, SuggestedOption } from '@/types';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

interface RequestBody {
  interview: Interview;
  messages: Message[];
  questionIndex: number;
  timeElapsed: number;
  skipSuggestions?: boolean;
}

export async function POST(request: Request) {
  try {
    const { interview, messages, questionIndex, timeElapsed, skipSuggestions = false }: RequestBody = await request.json();

    const timeRemaining = interview.time_limit_minutes - timeElapsed;
    const questionsRemaining = interview.questions.length - questionIndex;

    // Check if we should complete the interview
    if (timeRemaining <= 1 || (questionIndex >= interview.questions.length && questionsRemaining <= 0)) {
      return NextResponse.json({ complete: true });
    }

    const systemPrompt = `You are conducting a user interview. Your goal is to gather valuable insights while keeping the conversation natural and engaging.

Interview Goal: ${interview.goal}

${interview.guidelines ? `Guidelines: ${interview.guidelines}` : ''}

${interview.anchor_topics.length > 0 ? `Must-Cover Topics (ensure these are addressed):\n${interview.anchor_topics.map((t: string) => `- ${t}`).join('\n')}` : ''}

${interview.context_bucket?.text ? `Context:\n${interview.context_bucket.text}` : ''}

Base Questions (use as guidance):
${interview.questions.map((q: { text: string }, i: number) => `${i + 1}. ${q.text}`).join('\n')}

Interview Progress:
- Time remaining: approximately ${Math.ceil(timeRemaining)} minutes
- Questions answered: ${questionIndex}

Instructions:
1. Based on the participant's last response, decide whether to:
   - Ask a follow-up question to dig deeper into something interesting
   - Move to the next base question
   - Wrap up if enough insights have been gathered

2. If asking a follow-up, briefly explain WHY in a "thinking" field (this will be shown to the participant)

3. Keep questions conversational and open-ended

4. Pace the interview appropriately for the remaining time

Return your response as JSON:
{
  "thinking": "Brief explanation of why you're asking this (optional, for follow-ups)",
  "question": "Your next question",
  "complete": false,
  "responseSummary": "1-2 sentence summary of the participant's last response"${!skipSuggestions ? `,
  "suggestions": [
    { "title": "Short option title (7-8 words max)", "description": "Brief description (20 words max)" },
    { "title": "Another option", "description": "Another brief description" }
  ]` : ''}
}

For responseSummary:
- Briefly summarize the key point(s) from the participant's most recent answer
- Keep it to 1-2 concise sentences
- Neutral, factual tone

${!skipSuggestions ? `For suggestions:
- Generate 3-4 relevant response options that might help the participant articulate their thoughts
- Each suggestion should represent a different perspective or angle
- Title should be concise (7-8 words max)
- Description should be brief context (20 words max)
- Base suggestions on common patterns, the interview context, and what makes sense for this question` : ''}

Or if the interview should end:
{
  "complete": true
}`;

    // Build conversation history
    const conversationHistory = messages.map(m => ({
      role: m.role === 'agent' ? 'assistant' : 'user',
      content: m.content,
    })) as Array<{ role: 'user' | 'assistant'; content: string }>;

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: systemPrompt,
      messages: [
        ...conversationHistory,
        {
          role: 'user',
          content: 'Based on this conversation, what should be the next question? Return JSON only.',
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
      // Fallback to next base question
      if (questionIndex < interview.questions.length) {
        return NextResponse.json({
          question: interview.questions[questionIndex].text,
          complete: false,
        });
      }
      return NextResponse.json({ complete: true });
    }

    const response = JSON.parse(jsonMatch[0]);
    return NextResponse.json(response);
  } catch (error) {
    console.error('Interview response error:', error);
    return NextResponse.json(
      { error: 'Failed to generate response' },
      { status: 500 }
    );
  }
}
