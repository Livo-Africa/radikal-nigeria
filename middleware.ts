// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import {
    checkRateLimit,
    getClientIdentifier,
    getRateLimitConfig,
    getRetryAfter
} from './src/lib/rateLimit';

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Apply rate limiting to API routes only
    if (pathname.startsWith('/api/')) {
        // Skip rate limiting for webhooks (they have signature verification)
        if (pathname.startsWith('/api/webhooks/')) {
            return NextResponse.next();
        }

        // Get client identifier (IP address)
        const identifier = getClientIdentifier(request);

        // Get appropriate rate limit config for this endpoint
        const config = getRateLimitConfig(pathname);

        // Check rate limit
        const rateLimitResult = checkRateLimit(identifier, config);

        // If rate limited, return 429 Too Many Requests
        if (!rateLimitResult.allowed) {
            const retryAfter = getRetryAfter(rateLimitResult.reset);

            console.warn(
                `⚠️ Rate limit exceeded for ${identifier} on ${pathname} ` +
                `(${rateLimitResult.limit} req/${config.windowMs}ms)`
            );

            return new NextResponse(
                JSON.stringify({
                    error: 'Too many requests. Please try again later.',
                    retryAfter,
                }),
                {
                    status: 429,
                    headers: {
                        'Content-Type': 'application/json',
                        'Retry-After': retryAfter.toString(),
                        'X-RateLimit-Limit': rateLimitResult.limit.toString(),
                        'X-RateLimit-Remaining': '0',
                        'X-RateLimit-Reset': rateLimitResult.reset.toString(),
                    },
                }
            );
        }

        // Add rate limit headers to successful response
        const response = NextResponse.next();
        response.headers.set('X-RateLimit-Limit', rateLimitResult.limit.toString());
        response.headers.set('X-RateLimit-Remaining', rateLimitResult.remaining.toString());
        response.headers.set('X-RateLimit-Reset', rateLimitResult.reset.toString());

        return response;
    }

    return NextResponse.next();
}

// Configure which routes use this middleware
export const config = {
    matcher: '/api/:path*',
};
