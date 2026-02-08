import { notFound } from 'next/navigation';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import { createClient } from '@/lib/supabase/server';
import { ArrowLeft, BarChart2, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDate, formatTime } from '@/lib/utils';
import { InterviewLinkCopy } from '@/components/interview/link-copy';
import { ParticipantsList } from '@/components/interview/participants-list';
import { DuplicateButton } from '@/components/interview/duplicate-button';
import type { Interview, Participant } from '@/types';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function InterviewPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: interview, error } = await supabase
    .from('interviews')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !interview) {
    notFound();
  }

  const { data: participants } = await supabase
    .from('participants')
    .select('*')
    .eq('interview_id', id)
    .order('started_at', { ascending: false });

  const completedCount = participants?.filter(p => p.status === 'completed').length || 0;
  const inProgressCount = participants?.filter(p => p.status === 'in_progress').length || 0;

  const interviewUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/interview/${interview.url_token}`;

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-[13px] text-[#6B7280] hover:text-[#09090B] transition-colors mb-4">
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Dashboard
        </Link>

        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2.5 mb-1">
              <h1 className="text-xl font-bold text-[#09090B] tracking-tight">
                {interview.title}
              </h1>
              <span className={`inline-flex items-center px-2 py-0.5 text-[11px] font-medium rounded-full ${
                interview.status === 'published'
                  ? 'bg-[#DCFCE7] text-[#16A34A]'
                  : 'bg-[#FEF3C7] text-[#D97706]'
              }`}>
                {interview.status}
              </span>
              {interview.agentic_mode && (
                <span className="inline-flex items-center px-2 py-0.5 text-[11px] font-medium rounded-full bg-[#F3E8FF] text-[#9333EA]">
                  agentic
                </span>
              )}
            </div>
            <p className="text-[#6B7280] text-[13px]">
              Created {formatDate(interview.created_at)}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link href={`/interviews/${id}/edit`}>
              <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[13px] font-medium border border-[#E5E7EB] text-[#374151] hover:bg-[#F9FAFB] hover:border-[#D1D5DB] transition-all">
                <Pencil className="w-3.5 h-3.5" />
                Edit
              </button>
            </Link>
            <DuplicateButton interview={interview as Interview} />
            {interview.status === 'published' && (
              <Link href={`/interviews/${id}/results`}>
                <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[13px] font-medium bg-[#F97316] text-white hover:bg-[#EA580C] transition-all shadow-sm">
                  <BarChart2 className="w-3.5 h-3.5" />
                  Analytics
                </button>
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-4">
          {/* Interview Link */}
          {interview.status === 'published' && (
            <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 hover:border-[#D1D5DB] hover:shadow-md transition-all">
              <h3 className="text-[14px] font-semibold text-[#09090B] mb-1">Interview Link</h3>
              <p className="text-[13px] text-[#6B7280] mb-3">
                Share this link with participants to start the interview
              </p>
              <InterviewLinkCopy url={interviewUrl} />
            </div>
          )}

          {/* Goal & Context */}
          <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 hover:border-[#D1D5DB] hover:shadow-md transition-all">
            <h3 className="text-[14px] font-semibold text-[#09090B] mb-3">Interview Goal</h3>
            <div className="prose prose-sm max-w-none">
              <ReactMarkdown
                components={{
                  p: ({ children }) => <p className="text-[14px] text-[#374151] mb-2.5 last:mb-0">{children}</p>,
                  ul: ({ children }) => <ul className="text-[14px] text-[#374151] list-disc list-inside mb-2.5 space-y-0.5">{children}</ul>,
                  ol: ({ children }) => <ol className="text-[14px] text-[#374151] list-decimal list-inside mb-2.5 space-y-0.5">{children}</ol>,
                  li: ({ children }) => <li className="text-[#374151]">{children}</li>,
                  strong: ({ children }) => <strong className="text-[#09090B] font-semibold">{children}</strong>,
                  em: ({ children }) => <em className="text-[#6B7280]">{children}</em>,
                  h1: ({ children }) => <h1 className="text-[16px] font-semibold text-[#09090B] mb-1.5">{children}</h1>,
                  h2: ({ children }) => <h2 className="text-[15px] font-semibold text-[#09090B] mb-1.5">{children}</h2>,
                  h3: ({ children }) => <h3 className="text-[14px] font-semibold text-[#09090B] mb-1.5">{children}</h3>,
                }}
              >
                {interview.goal}
              </ReactMarkdown>
            </div>

            {interview.guidelines && (
              <div className="mt-4 pt-4 border-t border-[#E5E7EB]">
                <h4 className="text-[11px] uppercase tracking-wider text-[#F97316] font-semibold mb-1.5">Guidelines</h4>
                <p className="text-[13px] text-[#6B7280]">{interview.guidelines}</p>
              </div>
            )}

            {interview.anchor_topics && interview.anchor_topics.length > 0 && (
              <div className="mt-4 pt-4 border-t border-[#E5E7EB]">
                <h4 className="text-[11px] uppercase tracking-wider text-[#F97316] font-semibold mb-2">Must-Cover Topics</h4>
                <div className="flex flex-wrap gap-1.5">
                  {interview.anchor_topics.map((topic: string, i: number) => (
                    <span key={i} className="inline-flex items-center px-2.5 py-1 text-[12px] font-medium rounded-lg bg-[#F3F4F6] text-[#374151]">
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Questions */}
          <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 hover:border-[#D1D5DB] hover:shadow-md transition-all">
            <h3 className="text-[14px] font-semibold text-[#09090B] mb-3">
              Questions <span className="text-[#9CA3AF] font-normal">({interview.questions?.length || 0})</span>
            </h3>
            <ol className="space-y-3">
              {interview.questions?.map((q: { id: string; text: string }, i: number) => (
                <li key={q.id} className="flex gap-3">
                  <span className="text-[13px] text-[#9CA3AF] w-6 flex-shrink-0 font-medium">
                    {i + 1}.
                  </span>
                  <p className="text-[14px] text-[#374151]">{q.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Stats */}
          <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 hover:border-[#D1D5DB] hover:shadow-md transition-all">
            <h3 className="text-[14px] font-semibold text-[#09090B] mb-3">Statistics</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[13px] text-[#6B7280]">Time Limit</span>
                <span className="text-[13px] text-[#09090B] font-medium">
                  {formatTime(interview.time_limit_minutes)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[13px] text-[#6B7280]">Completed</span>
                <span className="text-[13px] text-[#16A34A] font-medium">{completedCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[13px] text-[#6B7280]">In Progress</span>
                <span className="text-[13px] text-[#F97316] font-medium">{inProgressCount}</span>
              </div>
            </div>
          </div>

          {/* Participants */}
          {participants && participants.length > 0 && (
            <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 hover:border-[#D1D5DB] hover:shadow-md transition-all">
              <h3 className="text-[14px] font-semibold text-[#09090B] mb-3">Recent Participants</h3>
              <ParticipantsList
                participants={participants as Participant[]}
                interviewId={id}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
