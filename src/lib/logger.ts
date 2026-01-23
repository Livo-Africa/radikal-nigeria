// src/lib/logger.ts
// Secure logging utility with PII redaction and environment-aware logging

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogOptions {
    redact?: boolean;
    metadata?: Record<string, any>;
}

/**
 * Redact sensitive information from strings
 */
function redactSensitiveData(data: any): any {
    if (typeof data === 'string') {
        // Redact phone numbers (keep last 4 digits)
        data = data.replace(/(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g, (match) => {
            const last4 = match.slice(-4);
            return `***${last4}`;
        });

        // Redact email addresses
        data = data.replace(/([a-zA-Z0-9._-]+)@([a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/g, (match, user, domain) => {
            return `${user.substring(0, 2)}***@${domain}`;
        });

        // Redact payment references (show only prefix)
        data = data.replace(/(ref_|trx_|pay_)[a-zA-Z0-9]+/gi, (match) => {
            const prefix = match.substring(0, 4);
            return `${prefix}***`;
        });

        return data;
    }

    if (Array.isArray(data)) {
        return data.map(item => redactSensitiveData(item));
    }

    if (typeof data === 'object' && data !== null) {
        const redacted: any = {};
        for (const key in data) {
            // Sensitive field keys
            if (['whatsappNumber', 'phone', 'phoneNumber', 'email'].includes(key)) {
                const value = String(data[key]);
                redacted[key] = value.substring(0, 3) + '***' + value.slice(-4);
            } else if (['paymentReference', 'reference', 'transactionId'].includes(key)) {
                redacted[key] = 'REF-***';
            } else if (key.toLowerCase().includes('password') || key.toLowerCase().includes('secret')) {
                redacted[key] = '***REDACTED***';
            } else {
                redacted[key] = redactSensitiveData(data[key]);
            }
        }
        return redacted;
    }

    return data;
}

/**
 * Determine if we should log based on environment and log level
 */
function shouldLog(level: LogLevel): boolean {
    const env = process.env.NODE_ENV;

    // In production, only log warnings and errors
    if (env === 'production') {
        return level === 'warn' || level === 'error';
    }

    // In development, log everything
    return true;
}

/**
 * Format log message with timestamp and level
 */
function formatMessage(level: LogLevel, message: string, metadata?: Record<string, any>): string {
    const timestamp = new Date().toISOString();
    const levelUpper = level.toUpperCase().padEnd(5);

    let formatted = `[${timestamp}] ${levelUpper} ${message}`;

    if (metadata && Object.keys(metadata).length > 0) {
        formatted += ` ${JSON.stringify(metadata)}`;
    }

    return formatted;
}

/**
 * Secure logger class
 */
class Logger {
    private env: string;

    constructor() {
        this.env = process.env.NODE_ENV || 'development';
    }

    /**
     * Log info message
     */
    info(message: string, options: LogOptions = {}) {
        if (!shouldLog('info')) return;

        const data = options.redact !== false && this.env === 'production'
            ? redactSensitiveData(options.metadata)
            : options.metadata;

        console.log(formatMessage('info', message, data));
    }

    /**
     * Log warning message
     */
    warn(message: string, options: LogOptions = {}) {
        if (!shouldLog('warn')) return;

        const data = options.redact !== false
            ? redactSensitiveData(options.metadata)
            : options.metadata;

        console.warn(formatMessage('warn', message, data));
    }

    /**
     * Log error message
     */
    error(message: string, error?: Error | any, options: LogOptions = {}) {
        if (!shouldLog('error')) return;

        const metadata: Record<string, any> = {
            ...options.metadata,
        };

        if (error) {
            if (error instanceof Error) {
                metadata.error = {
                    message: error.message,
                    stack: this.env === 'development' ? error.stack : undefined,
                };
            } else {
                metadata.error = error;
            }
        }

        const data = options.redact !== false
            ? redactSensitiveData(metadata)
            : metadata;

        console.error(formatMessage('error', message, data));
    }

    /**
     * Log debug message (only in development)
     */
    debug(message: string, data?: any) {
        if (this.env !== 'development') return;

        console.log(formatMessage('debug', message, data));
    }

    /**
     * Redact sensitive data from any value
     */
    redact(data: any): any {
        return redactSensitiveData(data);
    }
}

// Export singleton instance
export const logger = new Logger();

// Export for testing
export { redactSensitiveData };
