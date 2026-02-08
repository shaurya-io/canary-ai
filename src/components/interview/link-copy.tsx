'use client';

import { useState } from 'react';
import { Copy, Check, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface InterviewLinkCopyProps {
  url: string;
}

export function InterviewLinkCopy({ url }: InterviewLinkCopyProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 px-4 py-2.5 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg text-[13px] text-[#374151] overflow-x-auto">
        {url}
      </div>
      <Button variant="secondary" size="sm" onClick={handleCopy}>
        {copied ? (
          <Check className="w-4 h-4 text-[#16A34A]" />
        ) : (
          <Copy className="w-4 h-4" />
        )}
      </Button>
      <a href={url} target="_blank" rel="noopener noreferrer">
        <Button variant="secondary" size="sm">
          <ExternalLink className="w-4 h-4" />
        </Button>
      </a>
    </div>
  );
}
