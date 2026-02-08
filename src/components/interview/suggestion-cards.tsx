'use client';

import type { SuggestedOption } from '@/types';

interface SuggestionCardsProps {
  suggestions: SuggestedOption[];
  onSelect: (suggestion: SuggestedOption) => void;
  disabled?: boolean;
}

export function SuggestionCards({ suggestions, onSelect, disabled = false }: SuggestionCardsProps) {
  if (suggestions.length === 0) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
      {suggestions.map((suggestion, index) => (
        <button
          key={index}
          type="button"
          onClick={() => onSelect(suggestion)}
          disabled={disabled}
          className={`
            text-left p-4 border rounded-xl transition-all
            ${disabled
              ? 'border-[#1F1F23] bg-[#111113]/30 cursor-not-allowed opacity-50'
              : 'border-[#27272A] bg-[#111113] hover:border-[#0D9373]/50 hover:bg-[#0D9373]/5 focus:outline-none focus:border-[#0D9373] focus:ring-1 focus:ring-[#0D9373]/50'
            }
          `}
        >
          <h4 className="font-medium text-sm text-white mb-1">
            {suggestion.title}
          </h4>
          <p className="text-xs text-[#6B7280] leading-relaxed">
            {suggestion.description}
          </p>
        </button>
      ))}
    </div>
  );
}
