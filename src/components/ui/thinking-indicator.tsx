'use client';

import { useState, useEffect } from 'react';
import { getRandomThinkingWord } from '@/lib/utils';

interface ThinkingIndicatorProps {
  className?: string;
}

export function ThinkingIndicator({ className }: ThinkingIndicatorProps) {
  const [word, setWord] = useState(getRandomThinkingWord());
  const [dots, setDots] = useState('');

  useEffect(() => {
    // Cycle through words every 2 seconds
    const wordInterval = setInterval(() => {
      setWord(getRandomThinkingWord());
    }, 2000);

    // Animate dots every 500ms
    const dotInterval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 500);

    return () => {
      clearInterval(wordInterval);
      clearInterval(dotInterval);
    };
  }, []);

  return (
    <div className={className}>
      <div className="flex items-center gap-2">
        <div className="flex gap-1">
          <span className="w-2 h-2 bg-[#0D9373] rounded-full animate-pulse" style={{ animationDelay: '0ms' }} />
          <span className="w-2 h-2 bg-[#0D9373] rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
          <span className="w-2 h-2 bg-[#0D9373] rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
        </div>
        <span className="text-sm text-[#A1A1AA]">
          {word}<span className="inline-block w-6 text-left">{dots}</span>
        </span>
      </div>
    </div>
  );
}
