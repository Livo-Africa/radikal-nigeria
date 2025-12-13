// src/components/booking-nigeria/StickyPaymentBar.tsx
// Fixed bottom payment bar with highly visible add-ons

'use client';
import { useState } from 'react';
import { Plus, Lock, ChevronUp, Gift, Zap, Image, Scissors, Sparkles } from 'lucide-react';
import { Package, ADD_ONS, AddOn, formatNaira } from '@/utils/bookingDataNigeria';

interface StickyPaymentBarProps {
    package: Package | null;
    groupSize?: number;
    selectedAddOns: string[];
    onToggleAddOn: (addOnId: string) => void;
    total: number;
    isEnabled: boolean;
    onPay: () => void;
    isLoading: boolean;
}

// Add-on icons mapping
const ADD_ON_ICONS: Record<string, any> = {
    'extra-image': Image,
    'extra-outfit': Gift,
    'advanced-retouch': Scissors,
    'body-restructuring': Sparkles,
    'rush-delivery': Zap
};

export default function StickyPaymentBar({
    package: pkg,
    groupSize = 2,
    selectedAddOns,
    onToggleAddOn,
    total,
    isEnabled,
    onPay,
    isLoading
}: StickyPaymentBarProps) {
    const [showAddOns, setShowAddOns] = useState(false);

    if (!pkg) return null;

    const selectedAddOnDetails = ADD_ONS.filter(a => selectedAddOns.includes(a.id));
    const addOnsTotal = selectedAddOnDetails.reduce((sum, a) => sum + a.price, 0);
    const hasAddOns = selectedAddOns.length > 0;

    return (
        <>
            {/* Add-ons Expandable Panel */}
            {showAddOns && (
                <div
                    className="fixed inset-0 z-40 bg-black/50"
                    onClick={() => setShowAddOns(false)}
                >
                    <div
                        className="absolute bottom-[140px] left-0 right-0 mx-4 bg-white rounded-2xl p-4 shadow-2xl max-h-[60vh] overflow-y-auto"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <Gift className="w-5 h-5 text-[#D4AF37]" />
                                <h3 className="font-bold text-gray-900">Enhance Your Shoot</h3>
                            </div>
                            <button onClick={() => setShowAddOns(false)} className="text-gray-400">
                                <ChevronUp className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-3">
                            {ADD_ONS.map(addOn => {
                                const isSelected = selectedAddOns.includes(addOn.id);
                                const IconComponent = ADD_ON_ICONS[addOn.id] || Gift;

                                return (
                                    <button
                                        key={addOn.id}
                                        onClick={() => onToggleAddOn(addOn.id)}
                                        className={`
                      w-full p-4 rounded-xl flex items-center gap-4 transition-all
                      ${isSelected
                                                ? 'bg-gradient-to-r from-[#D4AF37]/20 to-[#D4AF37]/10 border-2 border-[#D4AF37]'
                                                : 'bg-gray-50 border-2 border-transparent hover:border-gray-200'
                                            }
                    `}
                                    >
                                        <div className={`
                      w-12 h-12 rounded-xl flex items-center justify-center
                      ${isSelected ? 'bg-[#D4AF37] text-white' : 'bg-gray-200 text-gray-600'}
                    `}>
                                            <IconComponent className="w-6 h-6" />
                                        </div>
                                        <div className="flex-1 text-left">
                                            <span className="font-bold text-gray-900">{addOn.name}</span>
                                            {addOn.description && (
                                                <p className="text-sm text-gray-500">{addOn.description}</p>
                                            )}
                                        </div>
                                        <div className="text-right">
                                            <span className={`text-lg font-bold ${isSelected ? 'text-[#D4AF37]' : 'text-gray-700'}`}>
                                                +{formatNaira(addOn.price)}
                                            </span>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

            {/* Main Payment Bar */}
            <div
                className={`
          fixed bottom-0 left-0 right-0 z-50
          bg-white/95 backdrop-blur-xl border-t border-gray-200
          shadow-[0_-8px_30px_rgba(0,0,0,0.12)]
          transition-all duration-500
          ${isEnabled ? 'translate-y-0' : 'translate-y-full'}
        `}
            >
                {/* Highly Visible Add Extras Banner */}
                <button
                    onClick={() => setShowAddOns(!showAddOns)}
                    className={`
            w-full py-3 px-4 flex items-center justify-center gap-2 transition-all
            ${hasAddOns
                            ? 'bg-gradient-to-r from-[#D4AF37]/20 to-purple-100 border-b border-[#D4AF37]/30'
                            : 'bg-gradient-to-r from-yellow-50 via-orange-50 to-pink-50 border-b border-orange-200 animate-pulse-slow'
                        }
          `}
                >
                    <Gift className={`w-5 h-5 ${hasAddOns ? 'text-[#D4AF37]' : 'text-orange-500'}`} />
                    <span className={`font-bold text-sm ${hasAddOns ? 'text-[#D4AF37]' : 'text-orange-600'}`}>
                        {hasAddOns
                            ? `${selectedAddOns.length} extra${selectedAddOns.length > 1 ? 's' : ''} added (+${formatNaira(addOnsTotal)})`
                            : '✨ Want extras? Rush delivery, more photos & more!'
                        }
                    </span>
                    <Plus className={`w-4 h-4 ${hasAddOns ? 'text-[#D4AF37]' : 'text-orange-500'}`} />
                </button>

                <div className="max-w-lg mx-auto px-4 py-4 pb-8">
                    {/* Selected Add-ons Tags */}
                    {hasAddOns && (
                        <div className="flex flex-wrap gap-2 mb-3">
                            {selectedAddOnDetails.map(addOn => (
                                <span
                                    key={addOn.id}
                                    className="text-xs bg-[#D4AF37]/10 text-[#D4AF37] px-3 py-1 rounded-full font-medium flex items-center gap-1"
                                >
                                    {addOn.name}
                                    <button
                                        onClick={() => onToggleAddOn(addOn.id)}
                                        className="hover:text-red-500"
                                    >
                                        ×
                                    </button>
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Package Summary Row */}
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <p className="text-sm text-gray-500 mb-0.5">
                                {pkg.name} • {pkg.images} photos
                            </p>
                            <div className="flex items-baseline gap-2">
                                <p className="text-2xl font-bold text-gray-900">
                                    {formatNaira(total)}
                                </p>
                                {hasAddOns && (
                                    <span className="text-xs text-gray-400 line-through">
                                        {formatNaira(total - addOnsTotal)}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Pay Button */}
                    <button
                        onClick={onPay}
                        disabled={!isEnabled || isLoading}
                        className={`
              w-full py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-3
              transition-all duration-300 transform
              ${isEnabled && !isLoading
                                ? 'bg-gradient-to-r from-[#D4AF37] via-[#C9A227] to-[#B8941F] text-white shadow-xl shadow-[#D4AF37]/40 active:scale-[0.98] hover:shadow-2xl'
                                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            }
            `}
                    >
                        {isLoading ? (
                            <>
                                <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
                                <span>Processing...</span>
                            </>
                        ) : (
                            <>
                                <Lock className="w-5 h-5" />
                                <span>Pay {formatNaira(total)}</span>
                            </>
                        )}
                    </button>

                    {/* Security Badge */}
                    <p className="text-center text-xs text-gray-400 mt-2 flex items-center justify-center gap-1">
                        <Lock className="w-3 h-3" />
                        Secured by Paystack
                    </p>
                </div>
            </div>

            <style jsx>{`
        @keyframes pulse-slow {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.8;
          }
        }
        .animate-pulse-slow {
          animation: pulse-slow 2s ease-in-out infinite;
        }
      `}</style>
        </>
    );
}
