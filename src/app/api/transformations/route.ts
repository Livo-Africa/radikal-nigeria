//src/app/api/transformations/route.ts
import { getTransformations } from '@/lib/google-sheets';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const transformations = await getTransformations();
    return NextResponse.json({ transformations });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch transformations' },
      { status: 500 }
    );
  }
}