// src/lib/sanitization.ts
// Input sanitization to prevent XSS, injection attacks, and data leakage

/**
 * Escape HTML special characters to prevent XSS in Telegram messages
 * Telegram supports HTML mode, so we must escape user inputs
 */
export function escapeHtml(text: string | null | undefined): string {
    if (!text) return '';

    return String(text)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

/**
 * Validate and sanitize WhatsApp phone number
 * Only allows digits and optional + prefix
 */
export function sanitizePhoneNumber(phone: string | null | undefined): string {
    if (!phone) return '';

    // Remove all non-digit characters except leading +
    const cleaned = String(phone).replace(/[^\d+]/g, '');

    // Ensure only one + at the start
    const sanitized = cleaned.replace(/\+/g, '').replace(/^/, cleaned.startsWith('+') ? '+' : '');

    // Validate length (typical phone numbers are 10-15 digits)
    if (sanitized.replace(/\+/g, '').length < 10 || sanitized.replace(/\+/g, '').length > 15) {
        console.warn(`⚠️ Suspicious phone number length: ${sanitized}`);
    }

    return sanitized;
}

/**
 * Truncate text to prevent DoS via massive inputs
 */
export function truncateText(text: string | null | undefined, maxLength: number): string {
    if (!text) return '';

    const str = String(text);
    if (str.length <= maxLength) return str;

    return str.substring(0, maxLength) + '...';
}

/**
 * Sanitize special requests and user-provided text
 * - Escape HTML
 * - Limit length
 * - Remove potentially dangerous patterns
 */
export function sanitizeUserText(
    text: string | null | undefined,
    maxLength: number = 500
): string {
    if (!text) return '';

    // Truncate first
    let sanitized = truncateText(text, maxLength);

    // Escape HTML
    sanitized = escapeHtml(sanitized);

    // Remove null bytes (can cause issues in some systems)
    sanitized = sanitized.replace(/\x00/g, '');

    return sanitized;
}

/**
 * Sanitize data for Google Sheets
 * Prevents formula injection attacks
 */
export function sanitizeForSheets(text: string | null | undefined): string {
    if (!text) return '';

    const str = String(text);

    // Check for formula injection patterns (=, +, -, @, \t, \r)
    // These can be exploited in CSV/Excel exports
    if (/^[=+\-@\t\r]/.test(str)) {
        // Prefix with single quote to disable formula execution
        return `'${str}`;
    }

    return str;
}

/**
 * Sanitize order data before processing
 * Returns sanitized copy of order data
 */
export function sanitizeOrderData(orderData: any): any {
    return {
        ...orderData,
        // Sanitize phone number
        whatsappNumber: sanitizePhoneNumber(orderData.whatsappNumber),

        // Sanitize user text fields
        specialRequests: sanitizeUserText(orderData.specialRequests, 500),

        // Sanitize style preferences
        style: orderData.style ? {
            hairstyle: {
                selectedName: sanitizeUserText(orderData.style.hairstyle?.selectedName, 100),
                customDescription: sanitizeUserText(orderData.style.hairstyle?.customDescription, 200),
            },
            makeup: {
                selectedName: sanitizeUserText(orderData.style.makeup?.selectedName, 100),
                customDescription: sanitizeUserText(orderData.style.makeup?.customDescription, 200),
            },
            background: {
                selectedName: sanitizeUserText(orderData.style.background?.selectedName, 100),
                customDescription: sanitizeUserText(orderData.style.background?.customDescription, 200),
            },
        } : {},

        // Sanitize outfit names if present
        outfits: Array.isArray(orderData.outfits)
            ? orderData.outfits.map((outfit: any) => ({
                ...outfit,
                name: sanitizeUserText(outfit.name, 100),
            }))
            : [],
    };
}

/**
 * Validate email format (basic validation)
 */
export function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Validate phone number format
 */
export function isValidPhoneNumber(phone: string): boolean {
    const sanitized = sanitizePhoneNumber(phone);
    const digitsOnly = sanitized.replace(/\+/g, '');

    // Must have 10-15 digits
    return digitsOnly.length >= 10 && digitsOnly.length <= 15;
}
