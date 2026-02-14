// src/hooks/useRetryFetch.ts
// A hook that provides a fetch wrapper with automatic retry logic.
// Supports silent retries for file uploads and configurable retry behavior.

import { useCallback, useRef } from 'react';

interface RetryConfig {
    /** Max number of retry attempts (default: 3) */
    maxRetries?: number;
    /** Base delay in ms between retries (default: 1000). Doubles on each retry. */
    baseDelay?: number;
    /** If true, retries happen silently without updating the error state (default: false) */
    silent?: boolean;
}

interface RetryFetchResult {
    /** Execute a fetch with retry logic */
    fetchWithRetry: (url: string, options?: RequestInit, config?: RetryConfig) => Promise<Response>;
    /** Whether a fetch is currently in progress */
    isRetrying: boolean;
    /** Current retry attempt number (0 = first attempt, not a retry) */
    retryCount: number;
}

/**
 * Hook for fetch calls with automatic retry on network errors.
 * 
 * Usage:
 * ```ts
 * const { fetchWithRetry } = useRetryFetch();
 * const response = await fetchWithRetry('/api/orders', {
 *   method: 'POST',
 *   body: formData
 * }, { maxRetries: 3, silent: true });
 * ```
 */
export function useRetryFetch(): RetryFetchResult {
    const retryCountRef = useRef(0);
    const isRetryingRef = useRef(false);

    const fetchWithRetry = useCallback(async (
        url: string,
        options?: RequestInit,
        config?: RetryConfig
    ): Promise<Response> => {
        const { maxRetries = 3, baseDelay = 1000, silent = false } = config || {};
        let lastError: Error | null = null;

        retryCountRef.current = 0;
        isRetryingRef.current = false;

        for (let attempt = 0; attempt <= maxRetries; attempt++) {
            try {
                retryCountRef.current = attempt;
                if (attempt > 0) {
                    isRetryingRef.current = true;
                    if (!silent) {
                        console.log(`🔄 Retry attempt ${attempt}/${maxRetries} for ${url}`);
                    }
                }

                const response = await fetch(url, options);

                // If server returned an error status, check if it's retryable
                if (!response.ok && response.status >= 500 && attempt < maxRetries) {
                    // Server error — retryable
                    const delay = baseDelay * Math.pow(2, attempt);
                    if (!silent) {
                        console.warn(`⚠️ Server error ${response.status}, retrying in ${delay}ms...`);
                    }
                    await new Promise(resolve => setTimeout(resolve, delay));
                    continue;
                }

                // Success or non-retryable error (4xx) — return the response
                isRetryingRef.current = false;
                return response;

            } catch (error) {
                lastError = error instanceof Error ? error : new Error(String(error));

                if (attempt < maxRetries) {
                    // Network error — retryable
                    const delay = baseDelay * Math.pow(2, attempt);
                    if (!silent) {
                        console.warn(`⚠️ Network error, retrying in ${delay}ms...`, lastError.message);
                    }
                    await new Promise(resolve => setTimeout(resolve, delay));
                } else {
                    if (!silent) {
                        console.error(`❌ All ${maxRetries} retries exhausted for ${url}`);
                    }
                }
            }
        }

        isRetryingRef.current = false;
        throw lastError || new Error('Fetch failed after all retries');
    }, []);

    return {
        fetchWithRetry,
        get isRetrying() { return isRetryingRef.current; },
        get retryCount() { return retryCountRef.current; }
    };
}
