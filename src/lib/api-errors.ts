import { NextResponse } from 'next/server';
import { ContentStoreError } from '@/lib/content-store';

export function apiError(error: unknown) {
  console.error(error);

  if (error instanceof ContentStoreError) {
    return NextResponse.json(
      {
        error: error.message,
        details: error.details,
      },
      { status: error.status },
    );
  }

  return NextResponse.json({ error: 'Unexpected server error.' }, { status: 500 });
}

