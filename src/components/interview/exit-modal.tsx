'use client';

import { X, Clock, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ExitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onResumeLater: () => void;
  onSubmitIncomplete: () => void;
  isSubmitting?: boolean;
}

export function ExitModal({
  isOpen,
  onClose,
  onResumeLater,
  onSubmitIncomplete,
  isSubmitting = false
}: ExitModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-[#111113] border border-[#1F1F23] rounded-xl max-w-md w-full mx-4 p-6">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#6B7280] hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-white">
            Exit Interview?
          </h2>
          <p className="text-sm text-[#A1A1AA] mt-2">
            Choose how you&apos;d like to proceed with your responses.
          </p>
        </div>

        {/* Options */}
        <div className="space-y-3">
          {/* Resume Later */}
          <button
            onClick={onResumeLater}
            className="w-full text-left p-4 border border-[#27272A] rounded-xl hover:border-[#3F3F46] hover:bg-[#18181B] transition-all group"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-[#06B6D4]/10 border border-[#06B6D4]/30 rounded-lg flex items-center justify-center flex-shrink-0">
                <Clock className="w-5 h-5 text-[#06B6D4]" />
              </div>
              <div>
                <h3 className="font-medium text-white group-hover:text-[#06B6D4] transition-colors">
                  Resume Later
                </h3>
                <p className="text-xs text-[#6B7280] mt-1">
                  Your progress is saved. Return anytime using the same link to continue where you left off.
                </p>
              </div>
            </div>
          </button>

          {/* Submit Incomplete */}
          <button
            onClick={onSubmitIncomplete}
            disabled={isSubmitting}
            className="w-full text-left p-4 border border-[#27272A] rounded-xl hover:border-[#F59E0B]/50 hover:bg-[#F59E0B]/5 transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-[#F59E0B]/10 border border-[#F59E0B]/30 rounded-lg flex items-center justify-center flex-shrink-0">
                <Send className="w-5 h-5 text-[#F59E0B]" />
              </div>
              <div>
                <h3 className="font-medium text-white group-hover:text-[#F59E0B] transition-colors">
                  {isSubmitting ? 'Submitting...' : 'Submit Incomplete'}
                </h3>
                <p className="text-xs text-[#6B7280] mt-1">
                  Submit your current responses now. You won&apos;t be able to return and add more answers.
                </p>
              </div>
            </div>
          </button>
        </div>

        {/* Cancel */}
        <div className="mt-6 pt-4 border-t border-[#1F1F23]">
          <Button
            variant="ghost"
            onClick={onClose}
            className="w-full"
          >
            Continue Interview
          </Button>
        </div>
      </div>
    </div>
  );
}
