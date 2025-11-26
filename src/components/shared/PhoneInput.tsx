// components/shared/PhoneInput.tsx
'use client';
import { useState } from 'react';
import { ChevronDown, Phone } from 'lucide-react';

interface Country {
    code: string;
    name: string;
    flag: string;
    dialCode: string;
}

const countries: Country[] = [
    { code: 'GH', name: 'Ghana', flag: '🇬🇭', dialCode: '+233' },
    { code: 'NG', name: 'Nigeria', flag: '🇳🇬', dialCode: '+234' },
    { code: 'KE', name: 'Kenya', flag: '🇰🇪', dialCode: '+254' },
    { code: 'US', name: 'United States', flag: '🇺🇸', dialCode: '+1' },
    { code: 'UK', name: 'United Kingdom', flag: '🇬🇧', dialCode: '+44' },
    { code: 'ZA', name: 'South Africa', flag: '🇿🇦', dialCode: '+27' },
    { code: 'TG', name: 'Togo', flag: 'TG', dialCode: '+228' },
    { code: 'CI', name: 'Ivory Coast', flag: '🇨🇮', dialCode: '+225' },
    { code: 'BF', name: 'Burkina Faso', flag: '🇧🇫', dialCode: '+226' },
    { code: 'CM', name: 'Cameroon', flag: '🇨🇲', dialCode: '+237' },
    { code: 'BJ', name: 'Benin', flag: '🇧🇯', dialCode: '+229' },
    { code: 'GN', name: 'Guinea', flag: '🇬🇳', dialCode: '+224' },
    { code: 'LR', name: 'Liberia', flag: '🇱🇷', dialCode: '+231' },
    { code: 'GM', name: 'Gambia', flag: '🇬🇲', dialCode: '+220' },
    { code: 'RW', name: 'Rwanda', flag: '🇷🇼', dialCode: '+250' },
    { code: 'ET', name: 'Ethiopia', flag: '🇪🇹', dialCode: '+251' },
    { code: 'UG', name: 'Uganda', flag: '🇺🇬', dialCode: '+256' },
    { code: 'DZ', name: 'Algeria', flag: '🇩🇿', dialCode: '+213' },
    { code: 'MA', name: 'Morocco', flag: '🇲🇦', dialCode: '+212' },
    { code: 'TN', name: 'Tunisia', flag: '🇹🇳', dialCode: '+216' },
    { code: 'EG', name: 'Egypt', flag: '🇪🇬', dialCode: '+20' },
    { code: 'SN', name: 'Senegal', flag: '🇸🇳', dialCode: '+221' },
    { code: 'SL', name: 'Sierra Leone', flag: '🇸🇱', dialCode: '+232' },
    { code: 'LS', name: 'Lesotho', flag: '🇱🇸', dialCode: '+266' },
    { code: 'MG', name: 'Madagascar', flag: '🇲🇬', dialCode: '+261' },
    { code: 'MW', name: 'Malawi', flag: '🇲🇼', dialCode: '+265' },
    { code: 'ML', name: 'Mali', flag: '🇲🇱', dialCode: '+223' },
    { code: 'MR', name: 'Mauritania', flag: '🇲🇷', dialCode: '+222' },
    { code: 'MU', name: 'Mauritius', flag: '🇲🇺', dialCode: '+230' },
    { code: 'MZ', name: 'Mozambique', flag: '🇲🇿', dialCode: '+258' },
    { code: 'NA', name: 'Namibia', flag: '🇳🇦', dialCode: '+264' },
    { code: 'ZM', name: 'Zambia', flag: '🇿🇲', dialCode: '+260' },
    { code: 'ZW', name: 'Zimbabwe', flag: '🇿🇼', dialCode: '+263' }
];

interface PhoneInputProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
}

export default function PhoneInput({ value, onChange, placeholder = "Phone number", className = "" }: PhoneInputProps) {
    const [selectedCountry, setSelectedCountry] = useState<Country>(countries[0]);
    const [isOpen, setIsOpen] = useState(false);

    const handleCountrySelect = (country: Country) => {
        setSelectedCountry(country);
        setIsOpen(false);
        // Update the phone number with new country code
        const numberWithoutCode = value.replace(/^\+\d+\s?/, '');
        onChange(country.dialCode + numberWithoutCode);
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const input = e.target.value.replace(/\D/g, '');
        onChange(selectedCountry.dialCode + input);
    };

    const displayValue = value.replace(selectedCountry.dialCode, '');

    return (
        <div className={`relative ${className}`}>
            <div className="flex border border-gray-300 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-[#D4AF37] focus-within:border-[#D4AF37] transition-all">
                {/* Country Selector */}
                <div className="relative">
                    <button
                        type="button"
                        onClick={() => setIsOpen(!isOpen)}
                        className="flex items-center space-x-2 px-3 py-3 bg-gray-50 border-r border-gray-300 hover:bg-gray-100 transition-colors"
                    >
                        <span className="text-lg">{selectedCountry.flag}</span>
                        <ChevronDown className="w-4 h-4 text-gray-600" />
                    </button>

                    {/* Country Dropdown */}
                    {isOpen && (
                        <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                            {countries.map((country) => (
                                <button
                                    key={country.code}
                                    onClick={() => handleCountrySelect(country)}
                                    className="flex items-center space-x-3 w-full px-3 py-2 hover:bg-gray-50 transition-colors"
                                >
                                    <span className="text-lg">{country.flag}</span>
                                    <span className="flex-1 text-left text-sm font-medium">{country.name}</span>
                                    <span className="text-sm text-gray-600">{country.dialCode}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Phone Input */}
                <div className="flex-1 flex items-center">
                    <Phone className="w-4 h-4 text-gray-400 ml-4" />
                    <span className="ml-2 text-gray-600">{selectedCountry.dialCode}</span>
                    <input
                        type="tel"
                        value={displayValue}
                        onChange={handlePhoneChange}
                        placeholder={placeholder}
                        className="flex-1 px-3 py-3 focus:outline-none"
                    />
                </div>
            </div>
        </div>
    );
}