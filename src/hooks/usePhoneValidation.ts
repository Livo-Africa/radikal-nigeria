// src/hooks/usePhoneValidation.ts
// Multi-country phone number validation and formatting

import { useState, useCallback, useMemo } from 'react';

interface PhoneValidationResult {
    isValid: boolean;
    formatted: string;
    error: string | null;
}

interface CountryConfig {
    code: string;
    country: string;
    flag: string;
    minLength: number;
    maxLength: number;
    prefixes: string[];
    formatPattern: string; // e.g., "XXX XXX XXXX"
}

// Country configurations with validation rules
export const COUNTRY_CONFIGS: CountryConfig[] = [
    {
        code: '+234',
        country: 'Nigeria',
        flag: '🇳🇬',
        minLength: 10,
        maxLength: 10,
        prefixes: ['70', '80', '81', '90', '91'],
        formatPattern: 'XXX XXX XXXX'
    },
    {
        code: '+233',
        country: 'Ghana',
        flag: '🇬🇭',
        minLength: 9,
        maxLength: 9,
        prefixes: ['20', '23', '24', '25', '26', '27', '50', '54', '55', '59', '57', '53', '56'],
        formatPattern: 'XX XXX XXXX'
    },
    {
        code: '+254',
        country: 'Kenya',
        flag: '🇰🇪',
        minLength: 9,
        maxLength: 9,
        prefixes: ['70', '71', '72', '73', '74', '75', '76', '77', '78', '79', '10', '11'],
        formatPattern: 'XXX XXX XXX'
    },
    {
        code: '+27',
        country: 'South Africa',
        flag: '🇿🇦',
        minLength: 9,
        maxLength: 9,
        prefixes: ['60', '61', '62', '63', '64', '65', '66', '67', '68', '69', '71', '72', '73', '74', '76', '78', '79', '81', '82', '83', '84'],
        formatPattern: 'XX XXX XXXX'
    },
    {
        code: '+1',
        country: 'USA',
        flag: '🇺🇸',
        minLength: 10,
        maxLength: 10,
        prefixes: [], // Any prefix valid in US
        formatPattern: 'XXX XXX XXXX'
    },
    {
        code: '+44',
        country: 'UK',
        flag: '🇬🇧',
        minLength: 10,
        maxLength: 10,
        prefixes: ['7'], // Mobile starts with 7
        formatPattern: 'XXXX XXX XXX'
    },
];

export function validatePhoneByCountry(localNumber: string, countryCode: string): PhoneValidationResult {
    const digits = localNumber.replace(/\D/g, '');
    const config = COUNTRY_CONFIGS.find(c => c.code === countryCode);

    if (!config) {
        // Unknown country - basic validation (7-15 digits)
        const isValid = digits.length >= 7 && digits.length <= 15;
        return {
            isValid,
            formatted: digits,
            error: isValid ? null : 'Invalid phone number length'
        };
    }

    // Check length
    if (digits.length < config.minLength) {
        return {
            isValid: false,
            formatted: digits,
            error: `Number too short (need ${config.minLength} digits)`
        };
    }

    if (digits.length > config.maxLength) {
        return {
            isValid: false,
            formatted: digits,
            error: `Number too long (max ${config.maxLength} digits)`
        };
    }

    // Check prefix (if country has specific prefixes)
    if (config.prefixes.length > 0) {
        const hasValidPrefix = config.prefixes.some(prefix => digits.startsWith(prefix));
        if (!hasValidPrefix) {
            return {
                isValid: false,
                formatted: digits,
                error: `Invalid ${config.country} number prefix`
            };
        }
    }

    // Format the number according to country pattern
    const formatted = formatPhoneNumber(digits, config.formatPattern);

    return {
        isValid: true,
        formatted,
        error: null
    };
}

function formatPhoneNumber(digits: string, pattern: string): string {
    let result = '';
    let digitIndex = 0;

    for (const char of pattern) {
        if (digitIndex >= digits.length) break;
        if (char === 'X') {
            result += digits[digitIndex];
            digitIndex++;
        } else {
            result += char;
        }
    }

    // Add remaining digits if any
    if (digitIndex < digits.length) {
        result += digits.slice(digitIndex);
    }

    return result;
}

export function formatPhoneForDisplay(localNumber: string, countryCode: string = '+234'): string {
    const config = COUNTRY_CONFIGS.find(c => c.code === countryCode);
    const digits = localNumber.replace(/\D/g, '');

    if (!config) {
        return digits;
    }

    return formatPhoneNumber(digits, config.formatPattern);
}

interface UsePhoneValidationReturn {
    countryCode: string;
    localNumber: string;
    fullNumber: string;
    isValid: boolean;
    error: string | null;
    countryConfig: CountryConfig | undefined;
    setCountryCode: (code: string) => void;
    setLocalNumber: (number: string) => void;
    validate: () => PhoneValidationResult;
    reset: () => void;
}

export function usePhoneValidation(defaultCountryCode: string = '+234'): UsePhoneValidationReturn {
    const [countryCode, setCountryCode] = useState(defaultCountryCode);
    const [localNumber, setLocalNumber] = useState('');

    const countryConfig = useMemo(() =>
        COUNTRY_CONFIGS.find(c => c.code === countryCode),
        [countryCode]
    );

    const handleLocalNumberChange = useCallback((number: string) => {
        // Only allow digits, strip leading zeros, limit to max length for country
        let digits = number.replace(/\D/g, '');

        // Remove leading zeros (e.g., 024 -> 24)
        digits = digits.replace(/^0+/, '');

        const maxLen = countryConfig?.maxLength || 15;
        setLocalNumber(digits.slice(0, maxLen));
    }, [countryConfig]);

    const validate = useCallback((): PhoneValidationResult => {
        return validatePhoneByCountry(localNumber, countryCode);
    }, [localNumber, countryCode]);

    const validationResult = validatePhoneByCountry(localNumber, countryCode);

    const reset = useCallback(() => {
        setCountryCode(defaultCountryCode);
        setLocalNumber('');
    }, [defaultCountryCode]);

    return {
        countryCode,
        localNumber,
        fullNumber: `${countryCode}${localNumber}`,
        isValid: validationResult.isValid,
        error: localNumber.length > 0 ? validationResult.error : null,
        countryConfig,
        setCountryCode,
        setLocalNumber: handleLocalNumberChange,
        validate,
        reset
    };
}

export default usePhoneValidation;
