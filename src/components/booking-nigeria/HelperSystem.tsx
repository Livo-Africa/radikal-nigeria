// src/components/booking-nigeria/HelperSystem.tsx
// Non-intrusive contextual help tooltips

'use client';
import { useState, useEffect } from 'react';
import { HELPER_TIPS } from '@/utils/bookingDataNigeria';

interface HelperSystemProps {
    section: keyof typeof HELPER_TIPS;
}

export default function HelperSystem({ section }: HelperSystemProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [dontShowAgain, setDontShowAgain] = useState(false);
    const [isHidden, setIsHidden] = useState(false);

    const tips = HELPER_TIPS[section] || [];

    // Check localStorage for "don't show again" preference
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const hidden = localStorage.getItem(`radikal_helper_hidden_${section}`);
            if (hidden === 'true') {
                setIsHidden(true);
            }
        }
    }, [section]);

    const handleDontShowAgain = () => {
        setDontShowAgain(true);
        setIsHidden(true);
        setIsOpen(false);
        if (typeof window !== 'undefined') {
            localStorage.setItem(`radikal_helper_hidden_${section}`, 'true');
        }
    };

    if (isHidden || tips.length === 0) return null;

    return (
        <div className="relative inline-block">
            {/* Help Icon Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`
          w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
          transition-all duration-200
          ${isOpen
                        ? 'bg-[#D4AF37] text-white'
                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                    }
        `}
            >
                i
            </button>

            {/* Tooltip */}
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Tooltip Content */}
                    <div className="absolute right-0 top-8 z-50 w-72 bg-white rounded-xl shadow-2xl border border-gray-100 p-4 animate-fadeIn">
                        {/* Arrow */}
                        <div className="absolute -top-2 right-2 w-4 h-4 bg-white border-l border-t border-gray-100 rotate-45" />

                        {/* Close Button */}
                        <button
                            onClick={() => setIsOpen(false)}
                            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        {/* Tips */}
                        <div className="space-y-2 pr-4">
                            <h4 className="font-bold text-gray-900 text-sm mb-3">💡 Tips</h4>
                            {tips.map((tip, index) => (
                                <div key={index} className="flex items-start gap-2 text-xs text-gray-600">
                                    <span className="text-[#D4AF37] mt-0.5">•</span>
                                    <span>{tip}</span>
                                </div>
                            ))}
                        </div>

                        {/* Don't show again */}
                        <div className="mt-4 pt-3 border-t border-gray-100">
                            <button
                                onClick={handleDontShowAgain}
                                className="flex items-center gap-2 text-xs text-gray-400 hover:text-gray-600"
                            >
                                <div className={`
                  w-4 h-4 rounded border flex items-center justify-center
                  ${dontShowAgain ? 'bg-gray-400 border-gray-400' : 'border-gray-300'}
                `}>
                                    {dontShowAgain && (
                                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                    )}
                                </div>
                                <span>Got it, don't show again</span>
                            </button>
                        </div>
                    </div>
                </>
            )}

            <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
        </div>
    );
}
