import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { getAdminConfigStatus, isAdminRequest } from '@/lib/admin-auth';
import { apiError } from '@/lib/api-errors';
import { resetCollection, type ContentCollection } from '@/lib/content-store';

export const dynamic = 'force-dynamic';

function guardAdmin(request: NextRequest) {
  const config = getAdminConfigStatus();

  if (!config.configured) {
    return NextResponse.json({ error: 'Admin is not configured.', missing: config.missing }, { status: 503 });
  }

  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  return null;
}

function parseCollection(value: string): ContentCollection | null {
  return value === 'gallery' || value === 'completed' ? value : null;
}

export async function POST(request: NextRequest, { params }: { params: { collection: string } }) {
  const blocked = guardAdmin(request);
  if (blocked) return blocked;

  const collection = parseCollection(params.collection);
  if (!collection) return NextResponse.json({ error: 'Invalid collection.' }, { status: 400 });

  try {
    const items = await resetCollection(collection);
    return NextResponse.json({ items });
  } catch (error) {
    return apiError(error);
  }
}

