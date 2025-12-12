// src/hooks/usePhoneValidation.ts
// Nigerian phone number validation and formatting

import { useState, useCallback } from 'react';

interface PhoneValidationResult {
    isValid: boolean;
    formatted: string;
    error: string | null;
}

interface UsePhoneValidationReturn {
    countryCode: string;
    localNumber: string;
    fullNumber: string;
    isValid: boolean;
    error: string | null;
    setCountryCode: (code: string) => void;
    setLocalNumber: (number: string) => void;
    validate: () => PhoneValidationResult;
}

// Valid Nigerian number prefixes
const VALID_NIGERIAN_PREFIXES = ['70', '80', '81', '90', '91'];

export function validateNigerianPhone(localNumber: string): PhoneValidationResult {
    // Remove all non-digits
    const digits = localNumber.replace(/\D/g, '');

    // Nigerian numbers are 10 digits (without country code)
    if (digits.length !== 10) {
        return {
            isValid: false,
            formatted: digits,
            error: digits.length < 10 ? 'Number too short' : 'Number too long'
        };
    }

    // Check prefix
    const prefix = digits.slice(0, 2);
    if (!VALID_NIGERIAN_PREFIXES.includes(prefix)) {
        return {
            isValid: false,
            formatted: digits,
            error: 'Invalid Nigerian number prefix'
        };
    }

    // Format as XXX XXX XXXX
    const formatted = `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;

    return {
        isValid: true,
        formatted,
        error: null
    };
}

export function formatPhoneForDisplay(localNumber: string): string {
    const digits = localNumber.replace(/\D/g, '');

    if (digits.length <= 3) {
        return digits;
    } else if (digits.length <= 6) {
        return `${digits.slice(0, 3)} ${digits.slice(3)}`;
    } else {
        return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6, 10)}`;
    }
}

export function usePhoneValidation(defaultCountryCode: string = '+234'): UsePhoneValidationReturn {
    const [countryCode, setCountryCode] = useState(defaultCountryCode);
    const [localNumber, setLocalNumber] = useState('');

    const handleLocalNumberChange = useCallback((number: string) => {
        // Only allow digits, limit to 10 characters
        const digits = number.replace(/\D/g, '').slice(0, 10);
        setLocalNumber(digits);
    }, []);

    const validate = useCallback((): PhoneValidationResult => {
        return validateNigerianPhone(localNumber);
    }, [localNumber]);

    const validationResult = validateNigerianPhone(localNumber);

    return {
        countryCode,
        localNumber,
        fullNumber: `${countryCode}${localNumber}`,
        isValid: validationResult.isValid,
        error: localNumber.length > 0 ? validationResult.error : null,
        setCountryCode,
        setLocalNumber: handleLocalNumberChange,
        validate
    };
}

export default usePhoneValidation;
