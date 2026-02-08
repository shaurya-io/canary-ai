import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import type { InterviewFormData, Question } from '@/types';
import { nanoid } from 'nanoid';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

interface GeneratedCategory {
  name: string;
  questions: Array<{
    text: string;
    isAIMultipleChoice?: boolean;
  }>;
}

export async function POST(request: Request) {
  try {
    const formData: InterviewFormData = await request.json();

    const systemPrompt = `You are an expert user researcher helping to create interview questions.
Your task is to generate thoughtful, open-ended questions organized into logical categories.

Guidelines:
- Create questions that are clear, concise, and conversational
- Focus on understanding experiences, behaviors, and motivations
- Avoid leading questions or those with yes/no answers
- Start with easier questions and progress to more complex ones
- Group questions into 2-4 logical categories (3-4 questions per category)
- Category names should be short and descriptive (e.g., "Background", "Experience", "Challenges", "Future Goals")
- Consider the time limit and keep the total number of questions reasonable

The questions should help achieve the interview goal while covering any anchor topics specified.`;

    const totalQuestions = formData.agentic_mode ? '6-9' : '9-12';

    const userPrompt = `Create interview questions based on the following:

**Title:** ${formData.title}

**Goal:** ${formData.goal}

**Time Limit:** ${formData.time_limit_minutes} minutes

**Interview Mode:** ${formData.agentic_mode ? 'Agentic (AI will ask follow-ups based on responses)' : 'Static (fixed questions only)'}

${formData.guidelines ? `**Guidelines for Follow-ups:** ${formData.guidelines}` : ''}

${formData.anchor_topics.length > 0 ? `**Must-Cover Topics:**\n${formData.anchor_topics.map(t => `- ${t}`).join('\n')}` : ''}

${formData.context_text ? `**Context:**\n${formData.context_text}` : ''}

Generate ${totalQuestions} interview questions organized into 2-4 categories (3-4 questions per category).

Return the questions as JSON in this format:
{
  "categories": [
    {
      "name": "Category Name",
      "questions": [
        { "text": "Question text?", "isAIMultipleChoice": true },
        { "text": "Another question?", "isAIMultipleChoice": true }
      ]
    }
  ]
}

Set isAIMultipleChoice to true (default) to show AI-generated response options that help participants articulate their thoughts.
Set isAIMultipleChoice to false for open-ended questions where you want raw, unbiased feedback without suggested options.

Only return the JSON object, no other text.`;

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2048,
      messages: [
        {
          role: 'user',
          content: userPrompt,
        },
      ],
      system: systemPrompt,
    });

    // Extract the text content
    const textContent = message.content.find(block => block.type === 'text');
    if (!textContent || textContent.type !== 'text') {
      throw new Error('No text response received');
    }

    // Parse the JSON object from the response
    const text = textContent.text.trim();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Could not parse questions from response');
    }

    const parsed = JSON.parse(jsonMatch[0]);
    const categories: GeneratedCategory[] = parsed.categories || [];

    // Transform to Question[] with category field and generate IDs
    let order = 0;
    const questions: Question[] = [];

    for (const category of categories) {
      for (const q of category.questions) {
        questions.push({
          id: nanoid(),
          text: q.text,
          order: order++,
          category: category.name,
          isAIMultipleChoice: q.isAIMultipleChoice !== false, // default to true
        });
      }
    }

    // Also return category names for the UI
    const categoryNames = categories.map(c => c.name);

    return NextResponse.json({ questions, categories: categoryNames });
  } catch (error) {
    console.error('Question generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate questions' },
      { status: 500 }
    );
  }
}
