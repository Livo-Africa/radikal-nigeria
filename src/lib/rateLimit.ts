// src/lib/rateLimit.ts
// Simple in-memory rate limiting for Vercel Edge Functions
// For production with multiple instances, consider using Upstash Redis (@upstash/ratelimit)

interface RateLimitEntry {
    count: number;
    resetTime: number;
}

// In-memory store (will be per-instance on Vercel)
const rateLimitStore = new Map<string, RateLimitEntry>();

// Rate limit configurations
export const RATE_LIMITS = {
    // Critical endpoints - stricter limits
    orders: {
        maxRequests: 10,
        windowMs: 60 * 1000, // 1 minute
    },
    // Read-only endpoints - more lenient
    readonly: {
        maxRequests: 100,
        windowMs: 60 * 60 * 1000, // 1 hour
    },
    // Default fallback
    default: {
        maxRequests: 30,
        windowMs: 60 * 1000, // 1 minute
    },
};

/**
 * Clean up expired entries (garbage collection)
 */
function cleanupExpiredEntries() {
    const now = Date.now();
    const entries = Array.from(rateLimitStore.entries());
    for (const [key, entry] of entries) {
        if (now > entry.resetTime) {
            rateLimitStore.delete(key);
        }
    }
}

/**
 * Get client identifier from request
 */
export function getClientIdentifier(request: Request): string {
    // Try to get real IP from Vercel headers
    const forwardedFor = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');

    // Use the first IP in x-forwarded-for (client's real IP)
    if (forwardedFor) {
        const ips = forwardedFor.split(',');
        return ips[0].trim();
    }

    if (realIp) {
        return realIp;
    }

    // Fallback to a generic identifier if no IP available
    return 'unknown';
}

/**
 * Check if request should be rate limited
 */
export function checkRateLimit(
    identifier: string,
    config: { maxRequests: number; windowMs: number }
): {
    allowed: boolean;
    limit: number;
    remaining: number;
    reset: number;
} {
    const now = Date.now();

    // Cleanup old entries periodically (every 100th request)
    if (Math.random() < 0.01) {
        cleanupExpiredEntries();
    }

    const entry = rateLimitStore.get(identifier);

    // No entry or expired entry - create new
    if (!entry || now > entry.resetTime) {
        rateLimitStore.set(identifier, {
            count: 1,
            resetTime: now + config.windowMs,
        });

        return {
            allowed: true,
            limit: config.maxRequests,
            remaining: config.maxRequests - 1,
            reset: now + config.windowMs,
        };
    }

    // Entry exists and not expired
    if (entry.count >= config.maxRequests) {
        return {
            allowed: false,
            limit: config.maxRequests,
            remaining: 0,
            reset: entry.resetTime,
        };
    }

    // Increment count
    entry.count++;
    rateLimitStore.set(identifier, entry);

    return {
        allowed: true,
        limit: config.maxRequests,
        remaining: config.maxRequests - entry.count,
        reset: entry.resetTime,
    };
}

/**
 * Get rate limit config based on endpoint path
 */
export function getRateLimitConfig(pathname: string): { maxRequests: number; windowMs: number } {
    if (pathname.includes('/api/orders')) {
        return RATE_LIMITS.orders;
    }

    if (
        pathname.includes('/api/outfits') ||
        pathname.includes('/api/testimonials') ||
        pathname.includes('/api/transformations')
    ) {
        return RATE_LIMITS.readonly;
    }

    return RATE_LIMITS.default;
}

/**
 * Format retry-after header value in seconds
 */
export function getRetryAfter(resetTime: number): number {
    const now = Date.now();
    const secondsUntilReset = Math.ceil((resetTime - now) / 1000);
    return Math.max(1, secondsUntilReset);
}
