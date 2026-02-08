'use client';

interface ResponseSummaryProps {
  summary: string;
}

export function ResponseSummary({ summary }: ResponseSummaryProps) {
  if (!summary) return null;

  return (
    <div className="flex justify-end">
      <div className="max-w-[85%] px-4 py-2 bg-[#18181B] border border-[#27272A] rounded-xl">
        <p className="text-xs text-[#6B7280] mb-1">Summary of your response</p>
        <p className="text-sm text-[#A1A1AA] italic">{summary}</p>
      </div>
    </div>
  );
}
