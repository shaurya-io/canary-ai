'use client';

import { type HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

type CardProps = HTMLAttributes<HTMLDivElement>;

export function Card({ className, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'bg-white border border-[#E5E7EB] rounded-xl p-6 shadow-sm hover:shadow-md hover:border-[#D1D5DB] transition-all duration-150',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

// Dark card variant for dark sections
export function CardDark({ className, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'bg-[#171717] border border-[#262626] rounded-xl p-6 text-white hover:border-[#404040] transition-all duration-150',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className, children, ...props }: CardProps) {
  return (
    <div className={cn('mb-4', className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ className, children, ...props }: CardProps) {
  return (
    <h3 className={cn('text-lg font-semibold text-[#09090B]', className)} {...props}>
      {children}
    </h3>
  );
}

export function CardDescription({ className, children, ...props }: CardProps) {
  return (
    <p className={cn('text-sm text-[#6B7280] mt-1', className)} {...props}>
      {children}
    </p>
  );
}

export function CardContent({ className, children, ...props }: CardProps) {
  return (
    <div className={cn('', className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ className, children, ...props }: CardProps) {
  return (
    <div className={cn('mt-4 pt-4 border-t border-[#E5E7EB] flex items-center gap-3', className)} {...props}>
      {children}
    </div>
  );
}
