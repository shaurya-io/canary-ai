'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Copy } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { generateToken } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import type { Interview } from '@/types';

interface DuplicateButtonProps {
  interview: Interview;
}

export function DuplicateButton({ interview }: DuplicateButtonProps) {
  const router = useRouter();
  const supabase = createClient();
  const [duplicating, setDuplicating] = useState(false);

  const handleDuplicate = async () => {
    setDuplicating(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const newUrlToken = generateToken(10);

      const { data: newInterview, error } = await supabase
        .from('interviews')
        .insert({
          author_id: user.id,
          title: `${interview.title} (Copy)`,
          goal: interview.goal,
          guidelines: interview.guidelines,
          time_limit_minutes: interview.time_limit_minutes,
          agentic_mode: interview.agentic_mode,
          anchor_topics: interview.anchor_topics,
          context_bucket: interview.context_bucket,
          questions: interview.questions,
          custom_summary_template: interview.custom_summary_template,
          status: 'draft', // Always start as draft
          url_token: newUrlToken,
        })
        .select()
        .single();

      if (error) throw error;

      router.push(`/interviews/${newInterview.id}`);
    } catch (error) {
      console.error('Failed to duplicate interview:', error);
    } finally {
      setDuplicating(false);
    }
  };

  return (
    <Button
      variant="secondary"
      onClick={handleDuplicate}
      disabled={duplicating}
    >
      <Copy className="w-4 h-4 mr-2" />
      {duplicating ? 'Duplicating...' : 'Duplicate'}
    </Button>
  );
}
