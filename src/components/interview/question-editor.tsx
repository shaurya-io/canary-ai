'use client';

import { useState, useMemo } from 'react';
import { GripVertical, Plus, Trash2, RefreshCw, Save, Send, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Question } from '@/types';
import { nanoid } from 'nanoid';

interface QuestionEditorProps {
  questions: Question[];
  onSave: (questions: Question[], publish: boolean) => void;
  onRegenerate: () => void;
  saving: boolean;
  isEditing?: boolean;
  currentStatus?: 'draft' | 'published';
}

export function QuestionEditor({ questions: initialQuestions, onSave, onRegenerate, saving, isEditing, currentStatus }: QuestionEditorProps) {
  const [questions, setQuestions] = useState<Question[]>(initialQuestions);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  // Group questions by category
  const categories = useMemo(() => {
    const cats = new Set(questions.map(q => q.category));
    return Array.from(cats);
  }, [questions]);

  const questionsByCategory = useMemo(() => {
    const grouped: Record<string, Question[]> = {};
    for (const cat of categories) {
      grouped[cat] = questions.filter(q => q.category === cat).sort((a, b) => a.order - b.order);
    }
    return grouped;
  }, [questions, categories]);

  const handleQuestionChange = (id: string, text: string) => {
    setQuestions(questions.map(q =>
      q.id === id ? { ...q, text } : q
    ));
  };

  const handleAIMultipleChoiceToggle = (id: string) => {
    setQuestions(questions.map(q =>
      q.id === id ? { ...q, isAIMultipleChoice: !q.isAIMultipleChoice } : q
    ));
  };

  const handleCategoryChange = (id: string, category: string) => {
    setQuestions(questions.map(q =>
      q.id === id ? { ...q, category } : q
    ));
  };

  const handleAddQuestion = (category: string) => {
    const categoryQuestions = questions.filter(q => q.category === category);
    const maxOrder = Math.max(...questions.map(q => q.order), -1);

    const newQuestion: Question = {
      id: nanoid(),
      text: '',
      order: maxOrder + 1,
      category,
      isAIMultipleChoice: true,
    };
    setQuestions([...questions, newQuestion]);
  };

  const handleRemoveQuestion = (id: string) => {
    const filtered = questions.filter(q => q.id !== id);
    // Reorder remaining questions
    const reordered = filtered.map((q, i) => ({ ...q, order: i }));
    setQuestions(reordered);
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newQuestions = [...questions];
    const draggedItem = newQuestions[draggedIndex];
    newQuestions.splice(draggedIndex, 1);
    newQuestions.splice(index, 0, draggedItem);
    newQuestions.forEach((q, i) => q.order = i);

    setQuestions(newQuestions);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  // Flatten questions for drag-drop across categories
  const flatQuestions = questions.sort((a, b) => a.order - b.order);

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-white">Review & Edit Questions</h1>
        <p className="text-[#A1A1AA] text-sm mt-2">
          Drag to reorder, edit text, or adjust categories
        </p>
      </div>

      {/* Questions grouped by category */}
      {categories.map(category => (
        <Card key={category} className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CardTitle className="text-lg">{category}</CardTitle>
                <Badge variant="default">{questionsByCategory[category]?.length || 0} questions</Badge>
              </div>
              {category === categories[0] && (
                <Button variant="ghost" size="sm" onClick={onRegenerate}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Regenerate All
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {questionsByCategory[category]?.map((question) => {
                const globalIndex = flatQuestions.findIndex(q => q.id === question.id);
                return (
                  <div
                    key={question.id}
                    draggable
                    onDragStart={() => handleDragStart(globalIndex)}
                    onDragOver={(e) => handleDragOver(e, globalIndex)}
                    onDragEnd={handleDragEnd}
                    className={`group flex items-start gap-3 p-4 border rounded-xl transition-colors ${
                      draggedIndex === globalIndex
                        ? 'opacity-50 border-[#0D9373] bg-[#0D9373]/5'
                        : 'border-[#27272A] bg-[#111113] hover:border-[#3F3F46]'
                    }`}
                  >
                    <button
                      type="button"
                      className="mt-2 cursor-grab active:cursor-grabbing text-[#6B7280] hover:text-white"
                    >
                      <GripVertical className="w-5 h-5" />
                    </button>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs text-[#6B7280]">
                          Q{globalIndex + 1}
                        </span>
                        <select
                          value={question.category}
                          onChange={(e) => handleCategoryChange(question.id, e.target.value)}
                          className="text-xs bg-[#18181B] border border-[#27272A] rounded px-2 py-0.5 text-[#A1A1AA]"
                        >
                          {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                      </div>
                      <Textarea
                        value={question.text}
                        onChange={(e) => handleQuestionChange(question.id, e.target.value)}
                        placeholder="Enter your question..."
                        rows={2}
                      />
                      {/* AI Multiple Choice toggle */}
                      <div className="mt-2 flex items-center gap-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={question.isAIMultipleChoice !== false}
                            onChange={() => handleAIMultipleChoiceToggle(question.id)}
                            className="w-4 h-4 rounded border-[#27272A] bg-[#18181B] text-[#0D9373] focus:ring-[#0D9373]"
                          />
                          <span className="text-xs text-[#A1A1AA]">AI Multiple Choice</span>
                        </label>
                        <div className="group/tooltip relative">
                          <Info className="w-3.5 h-3.5 text-[#6B7280] cursor-help" />
                          <div className="absolute left-0 bottom-full mb-2 w-64 p-2 bg-[#111113] border border-[#1F1F23] rounded-lg text-xs text-white opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all z-10">
                            When enabled, participants will see AI-generated response options to help them articulate their thoughts. Disable for open-ended questions where you want uninfluenced responses.
                          </div>
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveQuestion(question.id)}
                      className="mt-2 text-[#6B7280] hover:text-[#EF4444] opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Add Question to Category */}
            <Button
              type="button"
              variant="ghost"
              className="w-full mt-4 border border-dashed border-[#27272A] rounded-xl"
              onClick={() => handleAddQuestion(category)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Question to {category}
            </Button>
          </CardContent>
        </Card>
      ))}

      {/* Actions */}
      <div className="flex justify-end gap-4">
        {currentStatus !== 'published' && (
          <Button
            variant="secondary"
            onClick={() => onSave(questions, false)}
            disabled={saving || questions.length === 0}
          >
            <Save className="w-4 h-4 mr-2" />
            {isEditing ? 'Save Changes' : 'Save as Draft'}
          </Button>
        )}
        <Button
          onClick={() => onSave(questions, true)}
          disabled={saving || questions.length === 0}
          loading={saving}
        >
          <Send className="w-4 h-4 mr-2" />
          {isEditing && currentStatus === 'published' ? 'Update Interview' : 'Publish Interview'}
        </Button>
      </div>
    </div>
  );
}
