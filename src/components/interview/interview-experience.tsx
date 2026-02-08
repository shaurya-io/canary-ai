'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Clock, Send, CheckCircle, LogOut } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { ThinkingIndicator } from '@/components/ui/thinking-indicator';
import { ExitModal } from '@/components/interview/exit-modal';
import { SuggestionCards } from '@/components/interview/suggestion-cards';
import { ResponseSummary } from '@/components/interview/response-summary';
import { CategorySummary } from '@/components/interview/category-summary';
import { formatTime } from '@/lib/utils';
import type { Interview, Participant, Transcript, Message, SuggestedOption, Question } from '@/types';
import { nanoid } from 'nanoid';

interface InterviewExperienceProps {
  interview: Interview;
  participant: Participant;
  transcript: Transcript;
}

export function InterviewExperience({ interview, participant, transcript: initialTranscript }: InterviewExperienceProps) {
  const supabase = createClient();
  const [messages, setMessages] = useState<Message[]>(initialTranscript.messages || []);
  const [currentInput, setCurrentInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [isComplete, setIsComplete] = useState(participant.status === 'completed' || participant.status === 'incomplete');
  const [isIncomplete, setIsIncomplete] = useState(participant.status === 'incomplete');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [isSubmittingIncomplete, setIsSubmittingIncomplete] = useState(false);
  const [suggestions, setSuggestions] = useState<SuggestedOption[]>([]);
  const [lastResponseSummary, setLastResponseSummary] = useState<string | null>(null);
  const [showCategorySummary, setShowCategorySummary] = useState(false);
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const startTimeRef = useRef<number | null>(null);

  // Group questions by category
  const categorizedQuestions = useMemo(() => {
    const categories: { name: string; questions: Question[] }[] = [];
    const categoryMap = new Map<string, Question[]>();

    for (const q of interview.questions) {
      const category = q.category || 'General';
      if (!categoryMap.has(category)) {
        categoryMap.set(category, []);
      }
      categoryMap.get(category)!.push(q);
    }

    // Preserve order by iterating through original questions
    const seenCategories = new Set<string>();
    for (const q of interview.questions) {
      const category = q.category || 'General';
      if (!seenCategories.has(category)) {
        seenCategories.add(category);
        categories.push({ name: category, questions: categoryMap.get(category)! });
      }
    }

    return categories;
  }, [interview.questions]);

  // Get current category info
  const currentCategory = categorizedQuestions[currentCategoryIndex];
  const totalCategories = categorizedQuestions.length;

  // Initialize start time on mount
  useEffect(() => {
    startTimeRef.current = Date.now();
  }, []);

  // Calculate time remaining
  useEffect(() => {
    const updateTime = () => {
      if (!startTimeRef.current) return;
      const elapsed = (Date.now() - startTimeRef.current) / 1000 / 60;
      const remaining = Math.max(0, interview.time_limit_minutes - elapsed);

      if (remaining <= 0) {
        setTimeRemaining('Time is up');
      } else if (remaining < 2) {
        setTimeRemaining('Less than 2 minutes left');
      } else if (remaining < 5) {
        setTimeRemaining(`About ${Math.ceil(remaining)} minutes left`);
      } else {
        setTimeRemaining(null);
      }
    };

    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, [interview.time_limit_minutes]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Define askQuestion function before using it
  const askQuestion = useCallback(async (questionText: string, index: number, thinking?: string) => {
    setIsThinking(true);

    // Simulate thinking delay for natural feel
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));

    const newMessage: Message = {
      id: nanoid(),
      role: 'agent',
      content: questionText,
      thinking,
      timestamp: new Date().toISOString(),
    };

    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    setCurrentQuestionIndex(index);
    setIsThinking(false);

    // Save to database
    await supabase
      .from('transcripts')
      .update({ messages: updatedMessages })
      .eq('participant_id', participant.id);
  }, [messages, participant.id, supabase]);

  // Initialize with first question if no messages
  useEffect(() => {
    if (isInitialized) return;

    if (messages.length === 0 && interview.questions.length > 0) {
      const firstQuestion = interview.questions[0];
      askQuestion(firstQuestion.text, 0);
      setIsInitialized(true);
    } else {
      // Resume from where we left off
      const answeredCount = messages.filter(m => m.role === 'participant').length;
      setCurrentQuestionIndex(answeredCount);
      setIsInitialized(true);
    }
  }, [isInitialized, messages, interview.questions, askQuestion]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentInput.trim() || isThinking) return;

    // Clear suggestions and previous summary when submitting
    setSuggestions([]);
    setLastResponseSummary(null);

    const participantMessage: Message = {
      id: nanoid(),
      role: 'participant',
      content: currentInput.trim(),
      timestamp: new Date().toISOString(),
    };

    const updatedMessages = [...messages, participantMessage];
    setMessages(updatedMessages);
    setCurrentInput('');

    // Save participant message
    await supabase
      .from('transcripts')
      .update({ messages: updatedMessages })
      .eq('participant_id', participant.id);

    // Determine next action
    const nextIndex = currentQuestionIndex + 1;

    // Check if we finished the current category
    const questionsBeforeCurrentCategory = categorizedQuestions
      .slice(0, currentCategoryIndex)
      .reduce((sum, cat) => sum + cat.questions.length, 0);
    const currentCategoryEndIndex = questionsBeforeCurrentCategory + (currentCategory?.questions.length || 0);

    // If we just answered the last question in the category, show category summary
    if (nextIndex === currentCategoryEndIndex && totalCategories > 1) {
      setShowCategorySummary(true);
      return;
    }

    if (interview.agentic_mode) {
      // Call agent for next question or follow-up
      await handleAgenticResponse(updatedMessages, nextIndex);
    } else {
      // Static mode: just go to next question
      if (nextIndex < interview.questions.length) {
        const nextQuestion = interview.questions[nextIndex];
        await askQuestion(nextQuestion.text, nextIndex);
      } else {
        await completeInterview();
      }
    }
  };

  const handleAgenticResponse = async (currentMessages: Message[], nextIndex: number) => {
    setIsThinking(true);

    // Calculate elapsed time before the fetch
    // eslint-disable-next-line react-hooks/purity -- Date.now() is called in event handler, not during render
    const now = Date.now();
    const elapsedMinutes = startTimeRef.current ? (now - startTimeRef.current) / 1000 / 60 : 0;

    // Check if the next question should skip AI suggestions
    // (when AI Multiple Choice is disabled, we skip generating suggestions)
    const nextQuestion = interview.questions[nextIndex];
    const skipSuggestions = nextQuestion?.isAIMultipleChoice === false;

    try {
      const response = await fetch('/api/agent/interview-response', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          interview,
          messages: currentMessages,
          questionIndex: nextIndex,
          timeElapsed: elapsedMinutes,
          skipSuggestions,
        }),
      });

      const data = await response.json();

      if (data.complete) {
        await completeInterview();
      } else if (data.question) {
        await askQuestion(data.question, nextIndex, data.thinking);

        // Update messages with the new agent response
        const newMessage: Message = {
          id: nanoid(),
          role: 'agent',
          content: data.question,
          thinking: data.thinking,
          timestamp: new Date().toISOString(),
        };

        const updatedMessages = [...currentMessages, newMessage];
        setMessages(updatedMessages);
        setIsThinking(false);

        // Store suggestions if provided (and not non-leading)
        if (data.suggestions && Array.isArray(data.suggestions)) {
          setSuggestions(data.suggestions);
        } else {
          setSuggestions([]);
        }

        // Store response summary if provided
        if (data.responseSummary) {
          setLastResponseSummary(data.responseSummary);
        }

        await supabase
          .from('transcripts')
          .update({ messages: updatedMessages })
          .eq('participant_id', participant.id);
      }
    } catch (error) {
      console.error('Agent response error:', error);
      // Fallback to next static question
      if (nextIndex < interview.questions.length) {
        const fallbackQuestion = interview.questions[nextIndex];
        await askQuestion(fallbackQuestion.text, nextIndex);
      } else {
        await completeInterview();
      }
    }
  };

  const completeInterview = async () => {
    setIsComplete(true);

    // Update participant status
    await supabase
      .from('participants')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString(),
      })
      .eq('id', participant.id);

    // Trigger summary generation
    fetch('/api/agent/generate-summary', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        participantId: participant.id,
        interviewId: interview.id,
      }),
    }).catch(console.error);
  };

  const handleResumeLater = () => {
    setShowExitModal(false);
    // Progress is already saved automatically, just close the modal
    // User can return later using the same link
  };

  const handleSuggestionSelect = (suggestion: SuggestedOption) => {
    // Populate the input field with the suggestion title
    setCurrentInput(suggestion.title);
    // Focus the textarea so user can edit if needed
  };

  const handleCategoryContinue = async () => {
    setShowCategorySummary(false);

    // Move to next category
    const nextCategoryIndex = currentCategoryIndex + 1;

    if (nextCategoryIndex >= totalCategories) {
      // We've completed all categories
      await completeInterview();
    } else {
      // Move to next category and ask first question
      setCurrentCategoryIndex(nextCategoryIndex);
      const nextCategoryQuestions = categorizedQuestions[nextCategoryIndex].questions;
      if (nextCategoryQuestions.length > 0) {
        const nextQuestionGlobalIndex = categorizedQuestions
          .slice(0, nextCategoryIndex)
          .reduce((sum, cat) => sum + cat.questions.length, 0);
        await askQuestion(nextCategoryQuestions[0].text, nextQuestionGlobalIndex);
      }
    }
  };

  const handleCategoryEdit = () => {
    // Just close the summary - user can scroll up and see their answers
    // In the current implementation, they can't actually edit, but they can review
    setShowCategorySummary(false);
  };

  // Get current category's Q&A pairs for summary
  const getCurrentCategoryQA = (): Array<{ question: string; answer: string }> => {
    if (!currentCategory) return [];

    const questionsBeforeCurrentCategory = categorizedQuestions
      .slice(0, currentCategoryIndex)
      .reduce((sum, cat) => sum + cat.questions.length, 0);

    const qa: Array<{ question: string; answer: string }> = [];
    const agentMessages = messages.filter(m => m.role === 'agent');
    const participantMessages = messages.filter(m => m.role === 'participant');

    for (let i = 0; i < currentCategory.questions.length; i++) {
      const globalIndex = questionsBeforeCurrentCategory + i;
      const questionMsg = agentMessages[globalIndex];
      const answerMsg = participantMessages[globalIndex];

      if (questionMsg && answerMsg) {
        qa.push({
          question: questionMsg.content,
          answer: answerMsg.content,
        });
      }
    }

    return qa;
  };

  const handleSubmitIncomplete = async () => {
    setIsSubmittingIncomplete(true);

    try {
      // Update participant status to incomplete
      await supabase
        .from('participants')
        .update({
          status: 'incomplete',
          completed_at: new Date().toISOString(),
        })
        .eq('id', participant.id);

      // Trigger summary generation for incomplete responses
      fetch('/api/agent/generate-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          participantId: participant.id,
          interviewId: interview.id,
          isIncomplete: true,
        }),
      }).catch(console.error);

      setIsIncomplete(true);
      setIsComplete(true);
      setShowExitModal(false);
    } catch (error) {
      console.error('Failed to submit incomplete:', error);
    } finally {
      setIsSubmittingIncomplete(false);
    }
  };

  // Show category summary between categories
  if (showCategorySummary && currentCategory) {
    return (
      <CategorySummary
        categoryName={currentCategory.name}
        messages={getCurrentCategoryQA()}
        isLastCategory={currentCategoryIndex === totalCategories - 1}
        onContinue={handleCategoryContinue}
        onEditAnswers={handleCategoryEdit}
      />
    );
  }

  if (isComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-[#0D0D0D]">
        <div className="text-center max-w-md">
          <div className={`w-16 h-16 ${isIncomplete ? 'bg-[#F59E0B]/10' : 'bg-[#0D9373]/10'} rounded-2xl mx-auto mb-6 flex items-center justify-center`}>
            <CheckCircle className={`w-8 h-8 ${isIncomplete ? 'text-[#F59E0B]' : 'text-[#0D9373]'}`} />
          </div>
          <h1 className="text-2xl font-semibold text-white mb-3">
            {isIncomplete ? 'Responses Submitted' : 'Interview Complete'}
          </h1>
          <p className="text-[#A1A1AA] text-sm mb-8">
            {isIncomplete
              ? 'Your partial responses have been recorded. Thank you for your time.'
              : 'Thank you for your time and valuable feedback. Your responses have been recorded.'}
          </p>
          <p className="text-xs text-[#6B7280]">
            You can close this window now.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#0D0D0D]">
      {/* Header */}
      <header className="border-b border-[#1F1F23] bg-[#111113]/90 backdrop-blur-xl sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="font-semibold text-white">{interview.title}</h1>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-xs text-[#A1A1AA]">
                {interview.agentic_mode ? 'Adaptive Interview' : 'Interview'}
              </p>
              {totalCategories > 1 && currentCategory && (
                <>
                  <span className="text-[#27272A]">|</span>
                  <p className="text-xs text-[#0D9373]">
                    {currentCategory.name} ({currentCategoryIndex + 1}/{totalCategories})
                  </p>
                </>
              )}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-[#6B7280]" />
              <span className={timeRemaining ? 'text-[#F59E0B]' : 'text-[#A1A1AA]'}>
                {timeRemaining || formatTime(interview.time_limit_minutes)}
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowExitModal(true)}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Exit
            </Button>
          </div>
        </div>
      </header>

      {/* Messages */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-4 py-6">
          <div className="space-y-6">
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}

            {/* Response Summary - shown after participant submits, before next question */}
            {lastResponseSummary && !isThinking && (
              <ResponseSummary summary={lastResponseSummary} />
            )}

            {isThinking && (
              <div className="flex justify-start">
                <div className="message-agent px-4 py-3">
                  <ThinkingIndicator />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>
      </main>

      {/* Suggestion Cards */}
      {suggestions.length > 0 && !isThinking && (
        <div className="border-t border-[#1F1F23] bg-[#18181B]">
          <div className="max-w-3xl mx-auto px-4 py-4">
            <p className="text-xs text-[#6B7280] mb-2">
              Click to use as a starting point for your response:
            </p>
            <SuggestionCards
              suggestions={suggestions}
              onSelect={handleSuggestionSelect}
              disabled={isThinking}
            />
          </div>
        </div>
      )}

      {/* Input */}
      <footer className="border-t border-[#1F1F23] bg-[#111113]">
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto px-4 py-4">
          <div className="relative group">
            {/* Input container with integrated send button */}
            <div className={`
              relative flex items-end
              bg-[#0D0D0D] border border-[#27272A] rounded-xl
              transition-all duration-300 ease-out
              ${!isThinking ? 'hover:border-[#3F3F46]' : ''}
              focus-within:border-[#0D9373] focus-within:ring-2 focus-within:ring-[#0D9373]/20
            `}>
              <textarea
                value={currentInput}
                onChange={(e) => {
                  setCurrentInput(e.target.value);
                  // Auto-resize
                  e.target.style.height = 'auto';
                  e.target.style.height = Math.min(e.target.scrollHeight, 200) + 'px';
                }}
                placeholder="Type your response..."
                disabled={isThinking}
                rows={1}
                className={`
                  flex-1 w-full px-4 py-3 pr-14
                  bg-transparent border-none outline-none
                  text-white text-sm leading-relaxed
                  placeholder:text-[#6B7280]
                  resize-none overflow-hidden
                  disabled:opacity-50 disabled:cursor-not-allowed
                  min-h-[48px] max-h-[200px]
                `}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
                style={{ height: 'auto' }}
              />

              {/* Send button - positioned inside input */}
              <button
                type="submit"
                disabled={!currentInput.trim() || isThinking}
                className={`
                  absolute right-2 bottom-2
                  w-10 h-10 rounded-lg
                  flex items-center justify-center
                  transition-all duration-200 ease-out
                  ${currentInput.trim() && !isThinking
                    ? 'bg-[#0D9373] text-white hover:bg-[#0FB68C] hover:scale-105 active:scale-95 shadow-lg'
                    : 'bg-[#18181B] text-[#6B7280] cursor-not-allowed'
                  }
                `}
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Helper text */}
          <p className="text-[11px] text-[#6B7280] mt-2 text-center tracking-wide">
            Press <kbd className="px-1.5 py-0.5 bg-[#18181B] rounded text-[#A1A1AA] mx-0.5">Enter</kbd> to send
            <span className="mx-2 text-[#27272A]">·</span>
            <kbd className="px-1.5 py-0.5 bg-[#18181B] rounded text-[#A1A1AA] mx-0.5">Shift + Enter</kbd> for new line
          </p>
        </form>
      </footer>

      {/* Exit Modal */}
      <ExitModal
        isOpen={showExitModal}
        onClose={() => setShowExitModal(false)}
        onResumeLater={handleResumeLater}
        onSubmitIncomplete={handleSubmitIncomplete}
        isSubmitting={isSubmittingIncomplete}
      />
    </div>
  );
}

function MessageBubble({ message }: { message: Message }) {
  const isAgent = message.role === 'agent';

  return (
    <div className={`flex ${isAgent ? 'justify-start' : 'justify-end'}`}>
      <div className={`max-w-[85%] ${isAgent ? 'space-y-2' : ''}`}>
        {/* Thinking block */}
        {isAgent && message.thinking && (
          <div className="px-3 py-2 bg-[#0D9373]/10 border-l-2 border-[#0D9373] rounded-r-lg text-sm text-[#0D9373]">
            <p className="text-xs text-[#6B7280] mb-1">Thinking...</p>
            <p>{message.thinking}</p>
          </div>
        )}

        {/* Message content */}
        <div
          className={`px-4 py-3 text-sm rounded-xl ${
            isAgent
              ? 'bg-[#111113] border border-[#1F1F23] text-white'
              : 'bg-[#0D9373] text-white'
          }`}
        >
          {message.content}
        </div>
      </div>
    </div>
  );
}
