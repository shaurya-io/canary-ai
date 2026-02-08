import { notFound, redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { InterviewExperience } from '@/components/interview/interview-experience';
import type { Interview, Participant, Transcript } from '@/types';

interface PageProps {
  params: Promise<{ token: string }>;
  searchParams: Promise<{ auth?: string }>;
}

export default async function InterviewPage({ params, searchParams }: PageProps) {
  const { token } = await params;
  const { auth } = await searchParams;

  const supabase = await createClient();

  // Get the interview by token
  const { data: interview, error } = await supabase
    .from('interviews')
    .select('*')
    .eq('url_token', token)
    .eq('status', 'published')
    .single();

  if (error || !interview) {
    notFound();
  }

  // If no auth token, redirect to join page
  if (!auth) {
    redirect(`/join?token=${token}`);
  }

  // Get participant by magic link token
  const { data: participant } = await supabase
    .from('participants')
    .select('*')
    .eq('magic_link_token', auth)
    .eq('interview_id', interview.id)
    .single();

  if (!participant) {
    redirect(`/join?token=${token}`);
  }

  // Get or create transcript
  let { data: transcript } = await supabase
    .from('transcripts')
    .select('*')
    .eq('participant_id', participant.id)
    .single();

  if (!transcript) {
    const { data: newTranscript } = await supabase
      .from('transcripts')
      .insert({
        participant_id: participant.id,
        messages: [],
        sentiment_scores: [],
      })
      .select()
      .single();

    transcript = newTranscript;
  }

  return (
    <InterviewExperience
      interview={interview as Interview}
      participant={participant as Participant}
      transcript={transcript as Transcript}
    />
  );
}
