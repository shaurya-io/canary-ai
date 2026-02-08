'use client';

import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, disabled, children, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
      // Orange primary button (Tensol style)
      primary: 'bg-[#F97316] text-white hover:bg-[#EA580C] focus:ring-[#F97316]/50 shadow-sm hover:shadow-md',
      // White/light secondary button
      secondary: 'bg-white text-[#374151] hover:bg-[#F9FAFB] border border-[#E5E7EB] hover:border-[#D1D5DB] focus:ring-[#F97316]/30',
      // Ghost button (subtle)
      ghost: 'bg-transparent text-[#6B7280] hover:text-[#374151] hover:bg-[#F9FAFB] focus:ring-[#F97316]/30',
      // Danger button
      danger: 'bg-[#FEF2F2] text-[#DC2626] hover:bg-[#FEE2E2] border border-[#FECACA] focus:ring-[#EF4444]/50',
      // Outline button
      outline: 'bg-transparent text-[#374151] border border-[#E5E7EB] hover:bg-[#F9FAFB] hover:border-[#D1D5DB] focus:ring-[#F97316]/30',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-[13px]',
      md: 'px-4 py-2 text-[14px]',
      lg: 'px-6 py-3 text-[15px]',
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Loading...
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
