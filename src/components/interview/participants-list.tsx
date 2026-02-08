'use client';

import Link from 'next/link';
import { User, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import type { Participant } from '@/types';

interface ParticipantsListProps {
  participants: Participant[];
  interviewId: string;
}

export function ParticipantsList({ participants, interviewId }: ParticipantsListProps) {
  return (
    <div className="space-y-2">
      {participants.slice(0, 5).map((participant) => (
        <Link
          key={participant.id}
          href={`/interviews/${interviewId}/participants/${participant.id}`}
          className="flex items-center gap-3 p-2 -mx-2 rounded-lg hover:bg-[#F9FAFB] transition-colors"
        >
          <div className="w-8 h-8 bg-[#F3F4F6] border border-[#E5E7EB] rounded-lg flex items-center justify-center">
            <User className="w-4 h-4 text-[#9CA3AF]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] text-[#374151] truncate">
              {participant.email}
            </p>
            <p className="text-[11px] text-[#9CA3AF]">
              {formatDate(participant.started_at)}
            </p>
          </div>
          {participant.status === 'completed' && (
            <CheckCircle className="w-4 h-4 text-[#16A34A]" />
          )}
          {participant.status === 'incomplete' && (
            <AlertCircle className="w-4 h-4 text-[#D97706]" />
          )}
          {participant.status === 'in_progress' && (
            <Clock className="w-4 h-4 text-[#9CA3AF]" />
          )}
        </Link>
      ))}

      {participants.length > 5 && (
        <p className="text-[11px] text-[#9CA3AF] text-center pt-2">
          +{participants.length - 5} more participants
        </p>
      )}
    </div>
  );
}
