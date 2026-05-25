import { NextResponse } from 'next/server';
import { getPublicContent } from '@/lib/content-store';
import { apiError } from '@/lib/api-errors';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    return NextResponse.json(await getPublicContent());
  } catch (error) {
    return apiError(error);
  }
}

