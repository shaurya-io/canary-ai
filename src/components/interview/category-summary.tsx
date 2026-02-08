'use client';

import { Button } from '@/components/ui/button';
import { ChevronRight, Edit2 } from 'lucide-react';
import type { Message } from '@/types';

interface CategorySummaryProps {
  categoryName: string;
  messages: Array<{ question: string; answer: string }>;
  isLastCategory: boolean;
  onContinue: () => void;
  onEditAnswers: () => void;
}

export function CategorySummary({
  categoryName,
  messages,
  isLastCategory,
  onContinue,
  onEditAnswers,
}: CategorySummaryProps) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-[#0D0D0D]">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <p className="text-[11px] text-[#0D9373] uppercase tracking-wider font-semibold mb-2">
            Section Complete
          </p>
          <h2 className="text-2xl font-semibold text-white">
            {categoryName}
          </h2>
          <p className="text-sm text-[#A1A1AA] mt-2">
            Here&apos;s a summary of your responses
          </p>
        </div>

        {/* Responses Summary */}
        <div className="space-y-4 mb-8">
          {messages.map((msg, i) => (
            <div
              key={i}
              className="bg-[#111113] border border-[#1F1F23] rounded-xl p-4"
            >
              <p className="text-xs text-[#6B7280] mb-2">
                Q{i + 1}
              </p>
              <p className="text-sm text-[#A1A1AA] mb-3">
                {msg.question}
              </p>
              <div className="border-l-2 border-[#0D9373]/50 pl-3">
                <p className="text-sm text-white">
                  {msg.answer}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex justify-center gap-4">
          <Button
            variant="ghost"
            onClick={onEditAnswers}
          >
            <Edit2 className="w-4 h-4 mr-2" />
            Edit Answers
          </Button>
          <Button onClick={onContinue}>
            {isLastCategory ? 'Complete Interview' : 'Continue to Next Section'}
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}
