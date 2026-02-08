'use client';

import { forwardRef, type TextareaHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const textareaId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="space-y-1.5">
        {label && (
          <label htmlFor={textareaId} className="text-[13px] font-medium text-[#09090B] block">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={cn(
            'w-full px-4 py-3 bg-white border border-[#E5E7EB] rounded-lg text-[#09090B] text-[15px]',
            'placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#F97316]/20 focus:border-[#F97316]',
            'transition-all duration-200 resize-none hover:border-[#D1D5DB]',
            error && 'border-[#EF4444] focus:ring-[#EF4444]/20 focus:border-[#EF4444]',
            className
          )}
          {...props}
        />
        {error && (
          <p className="text-xs text-[#EF4444]">{error}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
