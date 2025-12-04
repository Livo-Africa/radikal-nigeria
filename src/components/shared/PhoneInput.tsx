// src/components/shared/PhoneInput.tsx - FIXED DROPDOWN & VALIDATION
'use client';
import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

interface Country {
  code: string;
  name: string;
  dialCode: string;
  flag: string;
  maxLength: number; // Max digits for local number
}

const countries: Country[] = [
  { code: 'GH', name: 'Ghana', dialCode: '+233', flag: '🇬🇭', maxLength: 9 },
  { code: 'NG', name: 'Nigeria', dialCode: '+234', flag: '🇳🇬', maxLength: 10 },
  { code: 'KE', name: 'Kenya', dialCode: '+254', flag: '🇰🇪', maxLength: 9 },
  { code: 'US', name: 'United States', dialCode: '+1', flag: '🇺🇸', maxLength: 10 },
  { code: 'UK', name: 'United Kingdom', dialCode: '+44', flag: '🇬🇧', maxLength: 10 },
  { code: 'ZA', name: 'South Africa', dialCode: '+27', flag: '🇿🇦', maxLength: 9 },
  { code: 'IN', name: 'India', dialCode: '+91', flag: '🇮🇳', maxLength: 10 },
  { code: 'TG', name: 'Togo', flag: '🇹🇬', dialCode: '+228', maxLength: 8 },
  { code: 'CI', name: 'Ivory Coast', flag: '🇨🇮', dialCode: '+225', maxLength: 10 },
  { code: 'BF', name: 'Burkina Faso', flag: '🇧🇫', dialCode: '+226', maxLength: 8 },
  { code: 'CM', name: 'Cameroon', flag: '🇨🇲', dialCode: '+237', maxLength: 9 },
  { code: 'BJ', name: 'Benin', flag: '🇧🇯', dialCode: '+229', maxLength: 8 },
  { code: 'GN', name: 'Guinea', flag: '🇬🇳', dialCode: '+224', maxLength: 9 },
  { code: 'LR', name: 'Liberia', flag: '🇱🇷', dialCode: '+231', maxLength: 8 }, // Varies, usually 7-9
  { code: 'GM', name: 'Gambia', flag: '🇬🇲', dialCode: '+220', maxLength: 7 },
  { code: 'RW', name: 'Rwanda', flag: '🇷🇼', dialCode: '+250', maxLength: 9 },
  { code: 'ET', name: 'Ethiopia', flag: '🇪🇹', dialCode: '+251', maxLength: 9 },
  { code: 'UG', name: 'Uganda', flag: '🇺🇬', dialCode: '+256', maxLength: 9 },
  { code: 'DZ', name: 'Algeria', flag: '🇩🇿', dialCode: '+213', maxLength: 9 },
  { code: 'MA', name: 'Morocco', flag: '🇲🇦', dialCode: '+212', maxLength: 9 },
  { code: 'TN', name: 'Tunisia', flag: '🇹🇳', dialCode: '+216', maxLength: 8 },
  { code: 'EG', name: 'Egypt', flag: '🇪🇬', dialCode: '+20', maxLength: 10 },
  { code: 'SN', name: 'Senegal', flag: '🇸🇳', dialCode: '+221', maxLength: 9 },
  { code: 'SL', name: 'Sierra Leone', flag: '🇸🇱', dialCode: '+232', maxLength: 8 },
  { code: 'LS', name: 'Lesotho', flag: '🇱🇸', dialCode: '+266', maxLength: 8 },
  { code: 'MG', name: 'Madagascar', flag: '🇲🇬', dialCode: '+261', maxLength: 9 },
  { code: 'MW', name: 'Malawi', flag: '🇲🇼', dialCode: '+265', maxLength: 9 }, // 7-9
  { code: 'ML', name: 'Mali', flag: '🇲🇱', dialCode: '+223', maxLength: 8 },
  { code: 'MR', name: 'Mauritania', flag: '🇲🇷', dialCode: '+222', maxLength: 8 },
  { code: 'MU', name: 'Mauritius', flag: '🇲🇺', dialCode: '+230', maxLength: 7 }, // 7-8
  { code: 'MZ', name: 'Mozambique', flag: '🇲🇿', dialCode: '+258', maxLength: 9 },
  { code: 'NA', name: 'Namibia', flag: '🇳🇦', dialCode: '+264', maxLength: 9 }, // 7-9
  { code: 'ZM', name: 'Zambia', flag: '🇿🇲', dialCode: '+260', maxLength: 9 },
  { code: 'ZW', name: 'Zimbabwe', flag: '🇿🇼', dialCode: '+263', maxLength: 9 }
];


interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  required?: boolean;
}

export default function PhoneInput({
  value,
  onChange,
  placeholder = "Phone number",
  className = "",
  required = false
}: PhoneInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<Country>(countries[0]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Initialize selected country based on existing value if present
  useEffect(() => {
    if (value) {
      const matchingCountry = countries.find(c => value.startsWith(c.dialCode));
      if (matchingCountry) {
        setSelectedCountry(matchingCountry);
      }
    }
  }, []); // Run once on mount

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country);
    setIsOpen(false);

    // Update the phone number with new country code
    // Strip old country code if present, or just use the local part
    const currentLocal = value.replace(/^\+\d+/, '');

    // Truncate if current number is longer than new max length
    const newLocal = currentLocal.slice(0, country.maxLength);

    onChange(country.dialCode + newLocal);
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Allow only digits
    const input = e.target.value.replace(/\D/g, '');

    // Enforce max length for the selected country
    if (input.length > selectedCountry.maxLength) {
      return; // Ignore input if it exceeds limit
    }

    onChange(selectedCountry.dialCode + input);
  };

  // Extract local number for display (without country code)
  const displayValue = value.startsWith(selectedCountry.dialCode)
    ? value.slice(selectedCountry.dialCode.length)
    : value.replace(/^\+\d+/, ''); // Fallback if code doesn't match

  // Validate phone number format
  // Valid if it matches the expected length for the country
  const isValid = displayValue.length === selectedCountry.maxLength;

  return (
    <div className={`w-full ${className}`}>
      <div
        ref={dropdownRef}
        className={`relative flex border rounded-xl bg-white focus-within:ring-2 focus-within:ring-[#D4AF37] focus-within:border-[#D4AF37] transition-all ${isValid ? 'border-green-500' : value ? 'border-red-500' : 'border-gray-300'
          }`}
      >
        {/* Country Selector */}
        <div className="relative flex-shrink-0">
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center space-x-2 px-3 py-4 border-r bg-gray-50 hover:bg-gray-100 transition-colors h-full rounded-l-xl"
          >
            <span className="text-xl">{selectedCountry.flag}</span>
            <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown - Fixed z-index and positioning */}
          {isOpen && (
            <div className="absolute top-full left-0 mt-2 w-72 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 max-h-60 overflow-y-auto">
              <div className="sticky top-0 bg-gray-50 px-3 py-2 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase">
                Select Country
              </div>
              {countries.map((country) => (
                <button
                  key={country.code}
                  type="button"
                  onClick={() => handleCountrySelect(country)}
                  className={`flex items-center space-x-3 w-full px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0 ${selectedCountry.code === country.code ? 'bg-[#D4AF37]/10' : ''
                    }`}
                >
                  <span className="text-2xl">{country.flag}</span>
                  <span className="flex-1 text-left text-sm font-medium text-gray-900">{country.name}</span>
                  <span className="text-sm text-gray-500 font-mono">{country.dialCode}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Phone Number Input */}
        <div className="flex-1 flex items-center">
          <span className="pl-4 pr-2 text-gray-500 text-lg font-medium">{selectedCountry.dialCode}</span>
          <input
            type="tel"
            value={displayValue}
            onChange={handleNumberChange}
            placeholder={placeholder}
            className="flex-1 py-4 pr-4 outline-none bg-transparent text-lg text-gray-900 placeholder-gray-400"
            required={required}
          />
        </div>
      </div>

      {/* Validation Message */}
      {value && (
        <div className={`mt-2 text-xs font-medium flex items-center space-x-1 ${isValid ? 'text-green-600' : 'text-red-600'}`}>
          <span>{isValid ? '✓ Valid phone number' : `⚠ Please enter ${selectedCountry.maxLength} digits`}</span>
        </div>
      )}
    </div>
  );
}