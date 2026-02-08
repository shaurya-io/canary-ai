'use client';

import { useState } from 'react';
import { Plus, X, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Toggle } from '@/components/ui/toggle';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import type { InterviewFormData } from '@/types';

interface InterviewInputFormProps {
  onSubmit: (data: InterviewFormData) => void;
  initialData?: Partial<InterviewFormData>;
  isEditing?: boolean;
  onSkipToEdit?: () => void;
}

export function InterviewInputForm({ onSubmit, initialData, isEditing, onSkipToEdit }: InterviewInputFormProps) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [goal, setGoal] = useState(initialData?.goal || '');
  const [guidelines, setGuidelines] = useState(initialData?.guidelines || '');
  const [timeLimit, setTimeLimit] = useState(initialData?.time_limit_minutes || 15);
  const [agenticMode, setAgenticMode] = useState(initialData?.agentic_mode ?? true);
  const [anchorTopics, setAnchorTopics] = useState<string[]>(initialData?.anchor_topics || []);
  const [newAnchor, setNewAnchor] = useState('');
  const [contextText, setContextText] = useState(initialData?.context_text || '');
  const [customTemplate, setCustomTemplate] = useState(initialData?.custom_summary_template || '');

  const handleAddAnchor = () => {
    if (newAnchor.trim() && !anchorTopics.includes(newAnchor.trim())) {
      setAnchorTopics([...anchorTopics, newAnchor.trim()]);
      setNewAnchor('');
    }
  };

  const handleRemoveAnchor = (index: number) => {
    setAnchorTopics(anchorTopics.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      goal,
      guidelines,
      time_limit_minutes: timeLimit,
      agentic_mode: agenticMode,
      anchor_topics: anchorTopics,
      context_text: contextText,
      custom_summary_template: customTemplate,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#09090B] tracking-tight">
          {isEditing ? 'Edit Interview' : 'Create New Interview'}
        </h1>
        <p className="text-[#6B7280] text-[15px] mt-1">
          {isEditing
            ? 'Update interview settings and regenerate questions if needed'
            : 'Describe what you want to learn and Canary will generate questions'}
        </p>
      </div>

      <div className="space-y-6">
        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              label="Interview Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Product Onboarding Feedback"
              required
            />
            <Textarea
              label="Interview Goal"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="Describe what you want to learn from this interview. Be specific about the insights you're looking for."
              rows={4}
              required
            />
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <label className="text-[13px] font-medium text-[#09090B] block mb-1.5">
                  Time Limit (minutes)
                </label>
                <input
                  type="number"
                  min={5}
                  max={60}
                  value={timeLimit}
                  onChange={(e) => setTimeLimit(parseInt(e.target.value) || 15)}
                  className="w-24 px-4 py-3 bg-white border border-[#E5E7EB] rounded-lg text-[#09090B] text-[15px] focus:outline-none focus:ring-2 focus:ring-[#F97316]/20 focus:border-[#F97316] hover:border-[#D1D5DB]"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Agentic Mode */}
        <Card>
          <CardHeader>
            <CardTitle>Interview Mode</CardTitle>
            <CardDescription>
              Choose how the interview adapts to participant responses
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Toggle
              checked={agenticMode}
              onChange={setAgenticMode}
              label="Agentic Mode"
              description="AI adapts questions and asks follow-ups based on responses"
            />

            {agenticMode && (
              <>
                <Textarea
                  label="Guidelines for Follow-ups (optional)"
                  value={guidelines}
                  onChange={(e) => setGuidelines(e.target.value)}
                  placeholder="Natural language guidelines for how the AI should probe deeper. e.g., 'Focus on understanding pain points and workarounds'"
                  rows={3}
                />

                {/* Anchor Topics */}
                <div>
                  <label className="text-[13px] font-medium text-[#09090B] mb-2 block">
                    Must-Cover Topics
                  </label>
                  <p className="text-xs text-[#6B7280] mb-3">
                    Topics the AI must cover even if the conversation drifts
                  </p>
                  <div className="flex gap-2 mb-3">
                    <Input
                      value={newAnchor}
                      onChange={(e) => setNewAnchor(e.target.value)}
                      placeholder="e.g., Understand their onboarding experience"
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddAnchor())}
                    />
                    <Button type="button" variant="secondary" onClick={handleAddAnchor}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  {anchorTopics.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {anchorTopics.map((topic, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 px-3 py-1.5 bg-[#F3F4F6] border border-[#E5E7EB] rounded-lg text-sm text-[#374151]"
                        >
                          <span>{topic}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveAnchor(index)}
                            className="text-[#9CA3AF] hover:text-[#374151]"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Context Bucket */}
        <Card>
          <CardHeader>
            <CardTitle>Context</CardTitle>
            <CardDescription>
              Provide context that helps the AI craft better questions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              label="Context Information"
              value={contextText}
              onChange={(e) => setContextText(e.target.value)}
              placeholder="Add any context about your product, the participants, or background information that would help craft relevant questions."
              rows={6}
            />
            <div className="flex items-center gap-4 p-4 border border-dashed border-[#E5E7EB] rounded-xl bg-[#F9FAFB]">
              <Upload className="w-8 h-8 text-[#9CA3AF]" />
              <div className="flex-1">
                <p className="text-sm text-[#6B7280]">
                  File uploads coming soon
                </p>
                <p className="text-xs text-[#9CA3AF]">
                  Support for PDF, DOC, and TXT files
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Summary Template (Optional) */}
        <Card>
          <CardHeader>
            <CardTitle>Custom Summary Template (Optional)</CardTitle>
            <CardDescription>
              Define specific questions for the AI to answer in the interview summary
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={customTemplate}
              onChange={(e) => setCustomTemplate(e.target.value)}
              placeholder="e.g., What are the top 3 pain points mentioned? What features were requested? How satisfied are users with onboarding?"
              rows={4}
            />
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex justify-end gap-4">
          {isEditing && onSkipToEdit && (
            <Button type="button" variant="secondary" onClick={onSkipToEdit}>
              Edit Questions Only
            </Button>
          )}
          <Button type="submit">
            {isEditing ? 'Regenerate Questions' : 'Generate Questions'}
          </Button>
        </div>
      </div>
    </form>
  );
}
