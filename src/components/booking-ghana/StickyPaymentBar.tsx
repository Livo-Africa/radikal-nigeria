// src/components/booking-nigeria/StickyPaymentBar.tsx
// Fixed bottom payment bar - less intrusive, better z-index management

'use client';
import { useState } from 'react';
import { Plus, Lock, ChevronUp, ChevronDown, Gift, Zap, Image, Scissors, Sparkles, X } from 'lucide-react';
import { Package, ADD_ONS, AddOn, formatCurrency } from '@/utils/bookingDataGhana';

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
    const [isMinimized, setIsMinimized] = useState(false);

    if (!pkg) return null;

    const selectedAddOnDetails = ADD_ONS.filter(a => selectedAddOns.includes(a.id));
    const addOnsTotal = selectedAddOnDetails.reduce((sum, a) => sum + a.price, 0);
    const hasAddOns = selectedAddOns.length > 0;

    return (
        <>
            {/* Add-ons Modal - Full screen with sticky header */}
            {showAddOns && (
                <div
                    className="fixed inset-0 z-[60] bg-black/60"
                    onClick={() => setShowAddOns(false)}
                >
                    <div
                        className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl max-h-[70vh] flex flex-col"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* STICKY HEADER - Always visible */}
                        <div className="sticky top-0 bg-white border-b border-gray-100 p-4 rounded-t-3xl z-10">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Gift className="w-5 h-5 text-[#D4AF37]" />
                                    <h3 className="font-bold text-gray-900 text-lg">Enhance Your Shoot</h3>
                                </div>
                                <button
                                    onClick={() => setShowAddOns(false)}
                                    className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center"
                                >
                                    <X className="w-5 h-5 text-gray-600" />
                                </button>
                            </div>
                            {hasAddOns && (
                                <p className="text-sm text-[#D4AF37] font-medium mt-2">
                                    +{formatCurrency(addOnsTotal)} in extras selected
                                </p>
                            )}
                        </div>

                        {/* Scrollable Content */}
                        <div className="overflow-y-auto flex-1 p-4">
                            <div className="space-y-3 pb-4">
                                {ADD_ONS.map(addOn => {
                                    const isSelected = selectedAddOns.includes(addOn.id);
                                    const IconComponent = ADD_ON_ICONS[addOn.id] || Gift;

                                    return (
                                        <button
                                            key={addOn.id}
                                            onClick={() => onToggleAddOn(addOn.id)}
                                            className={`
                        w-full p-4 rounded-2xl flex items-center gap-4 transition-all active:scale-[0.98]
                        ${isSelected
                                                    ? 'bg-gradient-to-r from-[#D4AF37]/20 to-[#D4AF37]/10 border-2 border-[#D4AF37] shadow-lg'
                                                    : 'bg-gray-50 border-2 border-transparent hover:border-gray-200'
                                                }
                      `}
                                        >
                                            <div className={`
                        w-14 h-14 rounded-xl flex items-center justify-center
                        ${isSelected ? 'bg-[#D4AF37] text-white' : 'bg-white text-gray-600 shadow-sm'}
                      `}>
                                                <IconComponent className="w-7 h-7" />
                                            </div>
                                            <div className="flex-1 text-left">
                                                <span className="font-bold text-gray-900 text-base">{addOn.name}</span>
                                                {addOn.description && (
                                                    <p className="text-sm text-gray-500 mt-0.5">{addOn.description}</p>
                                                )}
                                            </div>
                                            <div className="text-right">
                                                <span className={`text-lg font-bold ${isSelected ? 'text-[#D4AF37]' : 'text-gray-700'}`}>
                                                    +{formatCurrency(addOn.price)}
                                                </span>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Done Button */}
                        <div className="p-4 border-t border-gray-100 bg-white">
                            <button
                                onClick={() => setShowAddOns(false)}
                                className="w-full py-3 bg-[#D4AF37] text-white font-bold rounded-xl"
                            >
                                Done
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Payment Bar - Compact design */}
            <div
                className={`
          fixed bottom-0 left-0 right-0 z-40
          bg-white border-t border-gray-200
          shadow-[0_-4px_20px_rgba(0,0,0,0.08)]
          transition-all duration-300
          ${isEnabled ? 'translate-y-0' : 'translate-y-full'}
        `}
            >
                {/* Minimize/Expand Toggle */}
                <button
                    onClick={() => setIsMinimized(!isMinimized)}
                    className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white rounded-t-lg px-4 py-1 border border-b-0 border-gray-200 shadow-sm"
                >
                    {isMinimized ? (
                        <ChevronUp className="w-4 h-4 text-gray-500" />
                    ) : (
                        <ChevronDown className="w-4 h-4 text-gray-500" />
                    )}
                </button>

                {isMinimized ? (
                    // Minimized View - Just total and pay button
                    <div className="px-4 py-3 flex items-center justify-between">
                        <div>
                            <span className="text-xl font-bold text-gray-900">{formatCurrency(total)}</span>
                        </div>
                        <button
                            onClick={onPay}
                            disabled={!isEnabled || isLoading}
                            className="bg-[#D4AF37] text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2"
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <>
                                    <Lock className="w-4 h-4" />
                                    <span>Pay</span>
                                </>
                            )}
                        </button>
                    </div>
                ) : (
                    // Full View
                    <div className="max-w-lg mx-auto">
                        {/* Add Extras Button - More appealing design */}
                        <button
                            onClick={() => setShowAddOns(true)}
                            className="w-full py-3 px-4 flex items-center justify-between bg-gradient-to-r from-purple-50 via-pink-50 to-orange-50 border-b border-gray-100"
                        >
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                                    <Sparkles className="w-4 h-4 text-white" />
                                </div>
                                <div className="text-left">
                                    <span className="font-bold text-gray-900 text-sm">
                                        {hasAddOns ? `${selectedAddOns.length} Extra${selectedAddOns.length > 1 ? 's' : ''} Added` : 'Enhance Your Shoot'}
                                    </span>
                                    {!hasAddOns && (
                                        <p className="text-xs text-gray-500">Rush delivery, extra photos & more</p>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                {hasAddOns && (
                                    <span className="text-sm font-bold text-purple-600">+{formatCurrency(addOnsTotal)}</span>
                                )}
                                <ChevronUp className="w-5 h-5 text-gray-400" />
                            </div>
                        </button>

                        <div className="px-4 py-4 pb-6">
                            {/* Selected Add-ons Tags */}
                            {hasAddOns && (
                                <div className="flex flex-wrap gap-2 mb-3">
                                    {selectedAddOnDetails.map(addOn => (
                                        <span
                                            key={addOn.id}
                                            className="text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-medium flex items-center gap-1"
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
                                    <p className="text-sm text-gray-500">
                                        {pkg.name} • {pkg.images} photos
                                    </p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {formatCurrency(total)}
                                    </p>
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
                                        ? 'bg-[#D4AF37] text-white shadow-lg shadow-[#D4AF37]/30 active:scale-[0.98]'
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
                                        <span>Pay {formatCurrency(total)}</span>
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
                )}
            </div>
        </>
    );
}
