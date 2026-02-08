'use client';

import { type HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'orange' | 'purple';
}

export function Badge({ className, variant = 'default', children, ...props }: BadgeProps) {
  const variants = {
    default: 'bg-[#F3F4F6] text-[#6B7280]',
    success: 'bg-[#DCFCE7] text-[#16A34A]',
    warning: 'bg-[#FEF3C7] text-[#D97706]',
    danger: 'bg-[#FEE2E2] text-[#DC2626]',
    orange: 'bg-[#FFF7ED] text-[#F97316]',
    purple: 'bg-[#F3E8FF] text-[#9333EA]',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
