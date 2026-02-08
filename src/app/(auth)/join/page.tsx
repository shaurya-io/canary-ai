'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { generateToken } from '@/lib/utils';

function JoinContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const supabase = createClient();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Get the interview by token
      const { data: interview, error: interviewError } = await supabase
        .from('interviews')
        .select('id, status')
        .eq('url_token', token)
        .single();

      if (interviewError || !interview) {
        throw new Error('Interview not found');
      }

      if (interview.status !== 'published') {
        throw new Error('This interview is not available');
      }

      // Check if participant already exists
      const { data: existingParticipant } = await supabase
        .from('participants')
        .select('id, magic_link_token')
        .eq('interview_id', interview.id)
        .eq('email', email)
        .single();

      let magicLinkToken: string;

      if (existingParticipant) {
        magicLinkToken = existingParticipant.magic_link_token;
      } else {
        // Create new participant
        magicLinkToken = generateToken(20);
        const { error: createError } = await supabase
          .from('participants')
          .insert({
            interview_id: interview.id,
            email,
            magic_link_token: magicLinkToken,
          });

        if (createError) throw createError;
      }

      // In a real app, you'd send an email here
      // For now, we'll just redirect directly
      router.push(`/interview/${token}?auth=${magicLinkToken}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-[#0D0D0D]">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-white mb-4">
            Invalid Link
          </h1>
          <p className="text-[#A1A1AA] mb-6">
            This interview link appears to be invalid.
          </p>
          <Link href="/">
            <Button variant="secondary">Go Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#0D0D0D]">
      {/* Aurora gradient */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-[#0D9373]/30 via-[#0D9373]/10 to-transparent rounded-full blur-[100px]" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-mono font-bold text-[#0D9373]">
            {'>'} canary_
          </h1>
          <p className="text-[#A1A1AA] text-sm mt-2">
            You&apos;ve been invited to an interview
          </p>
        </div>

        {/* Join Card */}
        <div className="bg-[#111113] border border-[#1F1F23] rounded-xl p-8">
          <h2 className="text-xl font-semibold text-white mb-2">
            Enter your email to continue
          </h2>
          <p className="text-sm text-[#A1A1AA] mb-6">
            We&apos;ll use this to save your progress so you can resume later.
          </p>

          <form onSubmit={handleJoin} className="space-y-4">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />

            {error && (
              <div className="p-3 bg-[#EF4444]/10 border border-[#EF4444]/20 rounded-lg text-[#EF4444] text-sm">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" loading={loading}>
              Start Interview
            </Button>
          </form>
        </div>

        {/* Footer */}
        <p className="mt-8 text-center text-xs text-[#6B7280]">
          Your responses will be shared with the interview creator.
        </p>
      </div>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0D0D0D]">
      <div className="text-[#A1A1AA] text-sm">Loading...</div>
    </div>
  );
}

export default function JoinPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <JoinContent />
    </Suspense>
  );
}
