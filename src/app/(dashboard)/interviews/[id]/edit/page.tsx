'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { InterviewInputForm } from '@/components/interview/input-form';
import { QuestionGenerator } from '@/components/interview/question-generator';
import { QuestionEditor } from '@/components/interview/question-editor';
import type { Interview, InterviewFormData, Question } from '@/types';

type Step = 'loading' | 'input' | 'generating' | 'editing';

export default function EditInterviewPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const supabase = createClient();

  const [step, setStep] = useState<Step>('loading');
  const [interview, setInterview] = useState<Interview | null>(null);
  const [formData, setFormData] = useState<InterviewFormData | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [saving, setSaving] = useState(false);

  // Fetch existing interview
  useEffect(() => {
    async function fetchInterview() {
      const { data, error } = await supabase
        .from('interviews')
        .select('*')
        .eq('id', id)
        .single();

      if (error || !data) {
        router.push('/dashboard');
        return;
      }

      setInterview(data as Interview);
      setQuestions(data.questions || []);
      setFormData({
        title: data.title,
        goal: data.goal,
        guidelines: data.guidelines || '',
        time_limit_minutes: data.time_limit_minutes,
        agentic_mode: data.agentic_mode,
        anchor_topics: data.anchor_topics || [],
        context_text: data.context_bucket?.text || '',
        custom_summary_template: data.custom_summary_template || '',
      });
      setStep('input');
    }

    fetchInterview();
  }, [id, router, supabase]);

  const handleInputSubmit = async (data: InterviewFormData) => {
    setFormData(data);
    setStep('generating');
  };

  const handleSkipToEdit = () => {
    setStep('editing');
  };

  const handleQuestionsGenerated = (generatedQuestions: Question[], _categories: string[]) => {
    setQuestions(generatedQuestions);
    setStep('editing');
  };

  const handleRegenerate = () => {
    setStep('generating');
  };

  const handleSave = async (finalQuestions: Question[], publish: boolean) => {
    if (!formData || !interview) return;
    setSaving(true);

    try {
      const { error } = await supabase
        .from('interviews')
        .update({
          title: formData.title,
          goal: formData.goal,
          guidelines: formData.guidelines || null,
          time_limit_minutes: formData.time_limit_minutes,
          agentic_mode: formData.agentic_mode,
          anchor_topics: formData.anchor_topics,
          context_bucket: {
            text: formData.context_text,
            files: interview.context_bucket?.files || [],
          },
          questions: finalQuestions,
          custom_summary_template: formData.custom_summary_template || null,
          status: publish ? 'published' : interview.status,
        })
        .eq('id', id);

      if (error) throw error;

      router.push(`/interviews/${id}`);
    } catch (error) {
      console.error('Failed to update interview:', error);
    } finally {
      setSaving(false);
    }
  };

  if (step === 'loading') {
    return (
      <div>
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-[var(--muted)] w-48"></div>
          <div className="h-4 bg-[var(--muted)] w-96"></div>
          <div className="h-64 bg-[var(--muted)]"></div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Back button */}
      <Link href={`/interviews/${id}`}>
        <Button variant="ghost" size="sm" className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Interview
        </Button>
      </Link>

      {step === 'input' && formData && (
        <InterviewInputForm
          onSubmit={handleInputSubmit}
          initialData={formData}
          isEditing
          onSkipToEdit={handleSkipToEdit}
        />
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
          isEditing
          currentStatus={interview?.status}
        />
      )}
    </div>
  );
}
