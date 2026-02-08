'use client';

import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="space-y-2">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-[#374151]">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'w-full px-4 py-3 bg-white border border-[#E5E7EB] rounded-lg text-[#09090B] text-[15px]',
            'placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#F97316]/20 focus:border-[#F97316]',
            'transition-all duration-150',
            error && 'border-[#EF4444] focus:ring-[#EF4444]/20 focus:border-[#EF4444]',
            className
          )}
          {...props}
        />
        {error && (
          <p className="text-sm text-[#DC2626]">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
