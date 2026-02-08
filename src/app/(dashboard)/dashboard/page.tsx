import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Plus, FileText, Users, Clock, ArrowRight } from 'lucide-react';
import { formatDate, formatTime } from '@/lib/utils';
import type { Interview } from '@/types';

export default async function DashboardPage() {
  const supabase = await createClient();

  const { data: interviews } = await supabase
    .from('interviews')
    .select(`
      *,
      participants:participants(count)
    `)
    .order('created_at', { ascending: false });

  const publishedCount = interviews?.filter(i => i.status === 'published').length || 0;
  const draftCount = interviews?.filter(i => i.status === 'draft').length || 0;
  const totalParticipants = interviews?.reduce((acc, i) =>
    acc + (i.participants?.[0]?.count || 0), 0
  ) || 0;

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#09090B] tracking-tight">Dashboard</h1>
          <p className="text-[#6B7280] text-[15px] mt-1">
            Manage your interviews and view results
          </p>
        </div>
        <Link href="/interviews/new">
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-[14px] font-medium bg-[#F97316] text-white hover:bg-[#EA580C] transition-all shadow-sm">
            <Plus className="w-4 h-4" />
            New Interview
          </button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 hover:border-[#D1D5DB] hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[13px] uppercase tracking-wider text-[#6B7280] font-medium">Published</p>
              <p className="text-3xl font-bold text-[#09090B] mt-1">{publishedCount}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-[#DCFCE7] flex items-center justify-center">
              <FileText className="w-5 h-5 text-[#16A34A]" />
            </div>
          </div>
        </div>
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 hover:border-[#D1D5DB] hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[13px] uppercase tracking-wider text-[#6B7280] font-medium">Drafts</p>
              <p className="text-3xl font-bold text-[#09090B] mt-1">{draftCount}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-[#FEF3C7] flex items-center justify-center">
              <Clock className="w-5 h-5 text-[#D97706]" />
            </div>
          </div>
        </div>
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 hover:border-[#D1D5DB] hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[13px] uppercase tracking-wider text-[#6B7280] font-medium">Responses</p>
              <p className="text-3xl font-bold text-[#09090B] mt-1">{totalParticipants}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-[#EFF6FF] flex items-center justify-center">
              <Users className="w-5 h-5 text-[#3B82F6]" />
            </div>
          </div>
        </div>
      </div>

      {/* Interviews List */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <p className="text-[13px] uppercase tracking-wider text-[#F97316] font-semibold">Your Interviews</p>
        </div>

        {interviews && interviews.length > 0 ? (
          <div className="space-y-5">
            {interviews.map((interview) => (
              <InterviewCard key={interview.id} interview={interview as Interview & { participants: { count: number }[] }} />
            ))}
          </div>
        ) : (
          <div className="bg-white border border-[#E5E7EB] rounded-xl">
            <div className="py-16 text-center">
              <div className="w-14 h-14 rounded-xl bg-[#F3F4F6] flex items-center justify-center mx-auto mb-4">
                <FileText className="w-6 h-6 text-[#9CA3AF]" />
              </div>
              <h3 className="text-lg font-semibold text-[#09090B] mb-2">
                No interviews yet
              </h3>
              <p className="text-[15px] text-[#6B7280] mb-6 max-w-sm mx-auto">
                Create your first interview to start gathering insights from your users
              </p>
              <Link href="/interviews/new">
                <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-[14px] font-medium bg-[#F97316] text-white hover:bg-[#EA580C] transition-all shadow-sm">
                  <Plus className="w-4 h-4" />
                  Create Interview
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function InterviewCard({ interview }: { interview: Interview & { participants: { count: number }[] } }) {
  const participantCount = interview.participants?.[0]?.count || 0;

  return (
    <Link href={`/interviews/${interview.id}`}>
      <div className="bg-white border border-[#E5E7EB] rounded-xl px-5 py-4 hover:border-[#D1D5DB] hover:shadow-md transition-all cursor-pointer group">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-1.5">
              <h3 className="text-[15px] font-semibold text-[#09090B] truncate group-hover:text-[#F97316] transition-colors">
                {interview.title}
              </h3>
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
            <p className="text-[13px] text-[#6B7280] line-clamp-1">
              {interview.goal}
            </p>
          </div>
          <div className="flex items-center gap-5 ml-4 text-[13px] text-[#6B7280]">
            <div className="flex items-center gap-1.5">
              <Users className="w-4 h-4" />
              <span>{participantCount}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              <span>{formatTime(interview.time_limit_minutes)}</span>
            </div>
            <span className="text-[#9CA3AF]">{formatDate(interview.created_at)}</span>
            <ArrowRight className="w-4 h-4 text-[#D1D5DB] group-hover:text-[#F97316] transition-colors" />
          </div>
        </div>
      </div>
    </Link>
  );
}
