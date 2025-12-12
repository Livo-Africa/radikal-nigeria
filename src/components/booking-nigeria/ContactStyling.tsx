// src/components/booking-nigeria/ContactStyling.tsx
// Contact info with Nigerian phone validation and optional styling

'use client';
import { useState } from 'react';
import { formatPhoneForDisplay } from '@/hooks/usePhoneValidation';

interface ContactStylingProps {
    countryCode: string;
    phoneNumber: string;
    onPhoneChange: (countryCode: string, phoneNumber: string) => void;
    styling: {
        makeup: boolean;
        hairstyle: string;
        background: string;
    };
    onStylingChange: (styling: Partial<ContactStylingProps['styling']>) => void;
    isPhoneValid: boolean;
    phoneError: string | null;
}

const COUNTRY_CODES = [
    { code: '+234', country: 'Nigeria', flag: '🇳🇬' },
    { code: '+233', country: 'Ghana', flag: '🇬🇭' },
    { code: '+254', country: 'Kenya', flag: '🇰🇪' },
    { code: '+27', country: 'South Africa', flag: '🇿🇦' },
    { code: '+1', country: 'USA', flag: '🇺🇸' },
    { code: '+44', country: 'UK', flag: '🇬🇧' },
];

export default function ContactStyling({
    countryCode,
    phoneNumber,
    onPhoneChange,
    styling,
    onStylingChange,
    isPhoneValid,
    phoneError
}: ContactStylingProps) {
    const [showStyling, setShowStyling] = useState(false);
    const [showCountryDropdown, setShowCountryDropdown] = useState(false);

    const selectedCountry = COUNTRY_CODES.find(c => c.code === countryCode) || COUNTRY_CODES[0];

    const handlePhoneInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Only allow digits, max 10 characters
        const digits = e.target.value.replace(/\D/g, '').slice(0, 10);
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
            {/* Section Header */}
            <div className="text-center mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                    Contact & Details
                </h2>
                <p className="text-gray-500 text-sm">
                    We'll deliver your photos via WhatsApp
                </p>
            </div>

            {/* Phone Input */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200 mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                    WhatsApp Number *
                </label>

                <div className="flex gap-2">
                    {/* Country Code Selector */}
                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                            className="h-full px-3 py-3 bg-gray-50 border-2 border-gray-300 rounded-xl flex items-center gap-2 min-w-[90px] hover:border-[#D4AF37] transition-colors"
                        >
                            <span className="text-xl">{selectedCountry.flag}</span>
                            <span className="font-medium text-gray-700 text-sm">{selectedCountry.code}</span>
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        {/* Country Dropdown */}
                        {showCountryDropdown && (
                            <div className="absolute top-full left-0 mt-1 w-56 bg-white rounded-xl shadow-xl border border-gray-100 z-50 max-h-64 overflow-y-auto">
                                {COUNTRY_CODES.map((country) => (
                                    <button
                                        key={country.code}
                                        onClick={() => handleCountrySelect(country.code)}
                                        className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 text-left transition-colors border-b border-gray-50 last:border-0"
                                    >
                                        <span className="text-xl">{country.flag}</span>
                                        <span className="font-medium text-gray-900 text-sm">{country.country}</span>
                                        <span className="text-sm text-gray-500 ml-auto">{country.code}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Phone Input */}
                    <input
                        type="tel"
                        inputMode="numeric"
                        value={formatPhoneForDisplay(phoneNumber)}
                        onChange={handlePhoneInput}
                        placeholder="803 123 4567"
                        className={`flex-1 text-lg py-3 px-4 border-2 rounded-xl focus:ring-2 focus:ring-[#D4AF37]/20 outline-none transition-all ${getBorderClass()}`}
                    />
                </div>

                {/* Validation Feedback */}
                <div className="mt-2 flex items-center gap-2">
                    {phoneNumber.length > 0 && (
                        <>
                            {isPhoneValid ? (
                                <span className="text-green-600 text-sm font-medium flex items-center gap-1">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    Valid number
                                </span>
                            ) : (
                                <span className="text-red-500 text-sm">
                                    {phoneError || 'Please enter a valid Nigerian number'}
                                </span>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* Optional Styling Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <button
                    onClick={() => setShowStyling(!showStyling)}
                    className="w-full px-5 py-4 flex items-center justify-between text-left"
                >
                    <div className="flex items-center gap-2">
                        <span className="text-lg">✨</span>
                        <span className="font-medium text-gray-900">Optional Styling</span>
                        <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">Optional</span>
                    </div>
                    <svg
                        className={`w-5 h-5 text-gray-400 transition-transform ${showStyling ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>

                {showStyling && (
                    <div className="px-5 pb-5 space-y-4 border-t border-gray-100">
                        {/* Makeup Checkbox */}
                        <label className="flex items-start gap-3 pt-4 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={styling.makeup}
                                onChange={(e) => onStylingChange({ makeup: e.target.checked })}
                                className="mt-1 w-5 h-5 rounded border-gray-300 text-[#D4AF37] focus:ring-[#D4AF37]"
                            />
                            <div>
                                <span className="font-medium text-gray-900">Any makeup?</span>
                                <p className="text-sm text-gray-500">For female clients</p>
                            </div>
                        </label>

                        {/* Hairstyle Input */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Hairstyle preference
                            </label>
                            <input
                                type="text"
                                value={styling.hairstyle}
                                onChange={(e) => onStylingChange({ hairstyle: e.target.value })}
                                placeholder="e.g., Low cut, braids, afro..."
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 outline-none transition-all text-sm"
                            />
                        </div>

                        {/* Background Input */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Background/Theme idea
                            </label>
                            <input
                                type="text"
                                value={styling.background}
                                onChange={(e) => onStylingChange({ background: e.target.value })}
                                placeholder="e.g., Office setting, outdoor, studio..."
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 outline-none transition-all text-sm"
                            />
                        </div>

                        {/* Note */}
                        <p className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
                            💡 Our team will contact you for further clarity on styling preferences.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
