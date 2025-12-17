// src/app/api/transformations/route.ts
import { getTransformations } from '@/lib/google-sheets';
import { NextResponse } from 'next/server';
import { Transformation } from '@/types';

export async function GET() {
  try {
    let transformations = await getTransformations();

    // Server-side validation and filtering
    transformations = transformations.filter((t: Transformation) => {
      // Must be visible
      if (!t.visible) return false;

      // Must have both URLs
      if (!t.beforeUrl || !t.afterUrl) return false;

      // Validate URL format
      try {
        new URL(t.beforeUrl);
        new URL(t.afterUrl);
        return true;
      } catch {
        return false;
      }
    });

    // Add cache headers for performance
    const headers = {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30'
    };

    return NextResponse.json(
      { transformations },
      { status: 200, headers }
    );
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch transformations' },
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );
  }
}