// src/components/booking-nigeria/ContactStyling.tsx
// Contact info with multi-country phone validation - simpler validation message

'use client';
import { useState } from 'react';
import { formatPhoneForDisplay, COUNTRY_CONFIGS } from '@/hooks/usePhoneValidation';
import { Check } from 'lucide-react';

interface ContactStylingProps {
    countryCode: string;
    phoneNumber: string;
    onPhoneChange: (countryCode: string, phoneNumber: string) => void;
    isPhoneValid: boolean;
    phoneError: string | null;
}

export default function ContactStyling({
    countryCode,
    phoneNumber,
    onPhoneChange,
    isPhoneValid,
    phoneError
}: ContactStylingProps) {
    const [showCountryDropdown, setShowCountryDropdown] = useState(false);

    const selectedCountry = COUNTRY_CONFIGS.find(c => c.code === countryCode) || COUNTRY_CONFIGS[0];

    const handlePhoneInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const maxLen = selectedCountry.maxLength || 15;
        const digits = e.target.value.replace(/\D/g, '').slice(0, maxLen);
        onPhoneChange(countryCode, digits);
    };

    const handleCountrySelect = (code: string) => {
        onPhoneChange(code, phoneNumber);
        setShowCountryDropdown(false);
    };

    // Determine border color based on validation state
    const getBorderClass = () => {
        if (phoneNumber.length === 0) return 'border-gray-300';
        if (isPhoneValid) return 'border-green-500';
        return 'border-red-400';
    };

    return (
        <div className="w-full px-4">
            {/* Section Header - BIGGER AND MORE READABLE */}
            <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Contact Details
                </h2>
                <p className="text-base text-gray-600">
                    We'll deliver your amazing photos via WhatsApp
                </p>
            </div>

            {/* Phone Input */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                    WhatsApp Number *
                </label>

                <div className="flex gap-2">
                    {/* Country Code Selector */}
                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                            className="h-full px-3 py-3 bg-gray-50 border-2 border-gray-300 rounded-xl flex items-center gap-2 min-w-[100px] hover:border-[#D4AF37] transition-colors"
                        >
                            <span className="text-xl">{selectedCountry.flag}</span>
                            <span className="font-medium text-gray-700 text-sm">{selectedCountry.code}</span>
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        {/* Country Dropdown */}
                        {showCountryDropdown && (
                            <>
                                <div
                                    className="fixed inset-0 z-40"
                                    onClick={() => setShowCountryDropdown(false)}
                                />
                                <div className="absolute top-full left-0 mt-1 w-64 bg-white rounded-xl shadow-xl border border-gray-100 z-50 max-h-64 overflow-y-auto">
                                    {COUNTRY_CONFIGS.map((country) => (
                                        <button
                                            key={country.code}
                                            onClick={() => handleCountrySelect(country.code)}
                                            className={`
                        w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 text-left transition-colors border-b border-gray-50 last:border-0
                        ${country.code === countryCode ? 'bg-[#D4AF37]/10' : ''}
                      `}
                                        >
                                            <span className="text-xl">{country.flag}</span>
                                            <span className="font-medium text-gray-900 text-sm flex-1">{country.country}</span>
                                            <span className="text-sm text-gray-500">{country.code}</span>
                                            {country.code === countryCode && (
                                                <Check className="w-4 h-4 text-[#D4AF37]" />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>

                    {/* Phone Input */}
                    <input
                        type="tel"
                        inputMode="numeric"
                        value={formatPhoneForDisplay(phoneNumber, countryCode)}
                        onChange={handlePhoneInput}
                        placeholder={selectedCountry.formatPattern.replace(/X/g, '0')}
                        className={`flex-1 text-lg py-3 px-4 border-2 rounded-xl focus:ring-2 focus:ring-[#D4AF37]/20 outline-none transition-all ${getBorderClass()}`}
                    />
                </div>

                {/* Validation Feedback - SIMPLIFIED */}
                <div className="mt-2 flex items-center gap-2">
                    {phoneNumber.length > 0 && (
                        <>
                            {isPhoneValid ? (
                                <span className="text-green-600 text-sm font-medium flex items-center gap-1">
                                    <Check className="w-4 h-4" />
                                    Valid phone number
                                </span>
                            ) : (
                                <span className="text-red-500 text-sm">
                                    {phoneError || 'Please check the number'}
                                </span>
                            )}
                        </>
                    )}
                </div>

                {/* Help text */}
                <p className="mt-3 text-xs text-gray-400">
                    Supports: Ghana, Nigeria, Kenya, South Africa, USA, UK
                </p>
            </div>
        </div>
    );
}
