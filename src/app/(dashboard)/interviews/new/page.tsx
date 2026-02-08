'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { generateToken } from '@/lib/utils';
import { InterviewInputForm } from '@/components/interview/input-form';
import { QuestionGenerator } from '@/components/interview/question-generator';
import { QuestionEditor } from '@/components/interview/question-editor';
import type { InterviewFormData, Question } from '@/types';

type Step = 'input' | 'generating' | 'editing';

export default function NewInterviewPage() {
  const router = useRouter();
  const supabase = createClient();
  const [step, setStep] = useState<Step>('input');
  const [formData, setFormData] = useState<InterviewFormData | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [saving, setSaving] = useState(false);

  const handleInputSubmit = async (data: InterviewFormData) => {
    setFormData(data);
    setStep('generating');
  };

  const handleQuestionsGenerated = (generatedQuestions: Question[], _categories: string[]) => {
    setQuestions(generatedQuestions);
    setStep('editing');
  };

  const handleRegenerate = () => {
    setStep('generating');
  };

  const handleSave = async (finalQuestions: Question[], publish: boolean) => {
    if (!formData) return;
    setSaving(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const urlToken = generateToken(10);

      const { data: interview, error } = await supabase
        .from('interviews')
        .insert({
          author_id: user.id,
          title: formData.title,
          goal: formData.goal,
          guidelines: formData.guidelines || null,
          time_limit_minutes: formData.time_limit_minutes,
          agentic_mode: formData.agentic_mode,
          anchor_topics: formData.anchor_topics,
          context_bucket: {
            text: formData.context_text,
            files: [],
          },
          questions: finalQuestions,
          custom_summary_template: formData.custom_summary_template || null,
          status: publish ? 'published' : 'draft',
          url_token: urlToken,
        })
        .select()
        .single();

      if (error) throw error;

      router.push(`/interviews/${interview.id}`);
    } catch (error) {
      console.error('Failed to save interview:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      {step === 'input' && (
        <InterviewInputForm onSubmit={handleInputSubmit} />
      )}

      {step === 'generating' && formData && (
        <QuestionGenerator
          formData={formData}
          onComplete={handleQuestionsGenerated}
          onBack={() => setStep('input')}
        />
      )}

      {step === 'editing' && formData && (
        <QuestionEditor
          questions={questions}
          onSave={handleSave}
          onRegenerate={handleRegenerate}
          saving={saving}
        />
      )}
    </div>
  );
}
