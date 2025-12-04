import React from 'react';
import { ArrowRight, ArrowLeft } from 'lucide-react';

interface StickyActionButtonsProps {
  onNext?: () => void;
  onBack?: () => void;
  nextLabel?: string;
  backLabel?: string;
  showNext?: boolean;
  showBack?: boolean;
  isNextDisabled?: boolean;
  isLoading?: boolean;
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
}

export default function StickyActionButtons({
  onNext,
  onBack,
  nextLabel = 'Continue',
  backLabel = 'Back',
  showNext = true,
  showBack = true,
  isNextDisabled = false,
  isLoading = false,
  secondaryAction
}: StickyActionButtonsProps) {
  return (
    <div className="fixed bottom-0 left-0 w-full z-40 bg-gradient-to-t from-white via-white to-transparent pt-8 pb-6 px-4">
      {secondaryAction && (
        <div className="text-center mb-3">
          <button
            onClick={secondaryAction.onClick}
            className="text-sm text-gray-500 font-medium underline decoration-gray-300 underline-offset-4"
          >
            {secondaryAction.label}
          </button>
        </div>
      )}
      <div className="max-w-4xl mx-auto flex gap-4">
        {showBack && (
          <button
            onClick={onBack}
            className="flex-1 bg-gray-100 text-gray-800 font-bold py-4 rounded-2xl shadow-lg active:scale-95 transition-transform flex items-center justify-center space-x-2"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>{backLabel}</span>
          </button>
        )}

        {showNext && (
          <button
            onClick={onNext}
            disabled={isNextDisabled || isLoading}
            className={`
              flex-[2] font-bold py-4 rounded-2xl shadow-xl flex items-center justify-center space-x-2
              transition-all duration-300
              ${isNextDisabled
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-[#D4AF37] to-[#B91C1C] text-white hover:shadow-2xl active:scale-95'
              }
            `}
          >
            {isLoading ? (
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>{nextLabel}</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
