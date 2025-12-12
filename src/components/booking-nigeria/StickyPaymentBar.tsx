// src/components/booking-nigeria/StickyPaymentBar.tsx
// Fixed bottom payment bar with glass blur effect

'use client';
import { useState } from 'react';
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

    return (
        <>
            {/* Add-ons Panel (slides up when shown) */}
            {showAddOns && (
                <div
                    className="fixed inset-0 z-40 bg-black/50"
                    onClick={() => setShowAddOns(false)}
                >
                    <div
                        className="absolute bottom-[120px] left-0 right-0 bg-white rounded-t-2xl p-4 shadow-2xl"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-gray-900">Enhance Your Shoot</h3>
                            <button onClick={() => setShowAddOns(false)} className="text-gray-400">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="space-y-2 max-h-60 overflow-y-auto">
                            {ADD_ONS.map(addOn => {
                                const isSelected = selectedAddOns.includes(addOn.id);

                                return (
                                    <button
                                        key={addOn.id}
                                        onClick={() => onToggleAddOn(addOn.id)}
                                        className={`
                      w-full p-3 rounded-xl flex items-center justify-between transition-all
                      ${isSelected
                                                ? 'bg-[#D4AF37]/10 border-2 border-[#D4AF37]'
                                                : 'bg-gray-50 border-2 border-transparent hover:border-gray-200'
                                            }
                    `}
                                    >
                                        <div className="text-left">
                                            <span className="font-medium text-gray-900 text-sm">{addOn.name}</span>
                                            {addOn.description && (
                                                <p className="text-xs text-gray-500">{addOn.description}</p>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className={`text-sm font-bold ${isSelected ? 'text-[#D4AF37]' : 'text-gray-700'}`}>
                                                +{formatNaira(addOn.price)}
                                            </span>
                                            {isSelected && (
                                                <div className="w-5 h-5 bg-[#D4AF37] rounded-full flex items-center justify-center">
                                                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                </div>
                                            )}
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
          bg-white/80 backdrop-blur-xl border-t border-gray-200
          shadow-[0_-4px_20px_rgba(0,0,0,0.08)]
          transition-all duration-500
          ${isEnabled ? 'translate-y-0' : 'translate-y-full'}
        `}
            >
                <div className="max-w-lg mx-auto px-4 py-4 pb-8">
                    {/* Selected Add-ons Preview */}
                    {selectedAddOnDetails.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                            {selectedAddOnDetails.map(addOn => (
                                <span
                                    key={addOn.id}
                                    className="text-xs bg-[#D4AF37]/10 text-[#D4AF37] px-2 py-1 rounded-full font-medium"
                                >
                                    {addOn.name}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Package Summary */}
                    <div className="flex items-center justify-between mb-3">
                        <div>
                            <p className="text-xs text-gray-500">
                                {pkg.name} • {pkg.images} photos
                            </p>
                            <p className="text-lg font-bold text-gray-900">
                                {formatNaira(total)}
                            </p>
                        </div>

                        {/* Add-ons Toggle */}
                        <button
                            onClick={() => setShowAddOns(!showAddOns)}
                            className="text-[#D4AF37] text-sm font-medium flex items-center gap-1"
                        >
                            <span>+ Add extras</span>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>

                    {/* Pay Button */}
                    <button
                        onClick={onPay}
                        disabled={!isEnabled || isLoading}
                        className={`
              w-full py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-2
              transition-all duration-300 transform
              ${isEnabled && !isLoading
                                ? 'bg-gradient-to-r from-[#D4AF37] to-[#B8941F] text-white shadow-lg shadow-[#D4AF37]/30 active:scale-[0.98]'
                                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            }
            `}
                    >
                        {isLoading ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                <span>Processing...</span>
                            </>
                        ) : (
                            <>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                                <span>Pay {formatNaira(total)}</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </>
    );
}
