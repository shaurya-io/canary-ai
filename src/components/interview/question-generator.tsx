'use client';

import { useState, useEffect, useCallback } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThinkingIndicator } from '@/components/ui/thinking-indicator';
import { Card, CardContent } from '@/components/ui/card';
import type { InterviewFormData, Question } from '@/types';

interface QuestionGeneratorProps {
  formData: InterviewFormData;
  onComplete: (questions: Question[], categories: string[]) => void;
  onBack: () => void;
}

export function QuestionGenerator({ formData, onComplete, onBack }: QuestionGeneratorProps) {
  const [generating, setGenerating] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const generateQuestions = useCallback(async () => {
    setGenerating(true);
    setError(null);

    try {
      const response = await fetch('/api/agent/generate-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to generate questions');
      }

      const data = await response.json();

      // API now returns questions with category field already populated
      const questions: Question[] = data.questions;
      const categories: string[] = data.categories || [];

      onComplete(questions, categories);
    } catch (err) {
      console.error('Generation error:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate questions');
      setGenerating(false);
    }
  }, [formData, onComplete]);

  useEffect(() => {
    generateQuestions();
  }, [generateQuestions]);

  if (error) {
    return (
      <div>
        <div className="mb-8">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>

        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-red-400 mb-4">{error}</p>
            <Button onClick={generateQuestions}>Try Again</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <Button variant="ghost" onClick={onBack} disabled={generating}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
      </div>

      {/* Generation UI */}
      <Card>
        <CardContent className="py-16">
          <div className="text-center">
            <ThinkingIndicator className="justify-center mb-6" />
            <h2 className="text-xl font-semibold text-white mb-2">
              Crafting Your Interview
            </h2>
            <p className="text-sm text-[#A1A1AA] max-w-md mx-auto">
              Analyzing your goals and context to create thoughtful questions
              that will uncover valuable insights.
            </p>
          </div>

          {/* Visual progress */}
          <div className="mt-12 max-w-md mx-auto">
            <div className="space-y-4">
              <Step label="Understanding your goals" active />
              <Step label="Analyzing context" active={false} />
              <Step label="Generating questions" active={false} />
              <Step label="Refining for clarity" active={false} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Step({ label, active }: { label: string; active: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div
        className={`w-2 h-2 rounded-full ${
          active ? 'bg-[#0D9373] animate-pulse' : 'bg-[#27272A]'
        }`}
      />
      <span
        className={`text-sm ${
          active ? 'text-white' : 'text-[#6B7280]'
        }`}
      >
        {label}
      </span>
    </div>
  );
}
