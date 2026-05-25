import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { getAdminConfigStatus, isAdminRequest } from '@/lib/admin-auth';
import { apiError } from '@/lib/api-errors';
import {
  deleteItem,
  normalizeCompletedPatch,
  normalizeGalleryPatch,
  updateCompletedCommission,
  updateGalleryItem,
  type ContentCollection,
} from '@/lib/content-store';

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

export async function PATCH(request: NextRequest, { params }: { params: { collection: string; id: string } }) {
  const blocked = guardAdmin(request);
  if (blocked) return blocked;

  const collection = parseCollection(params.collection);
  if (!collection) return NextResponse.json({ error: 'Invalid collection.' }, { status: 400 });

  try {
    const body = await request.json();

    if (collection === 'gallery') {
      const item = await updateGalleryItem(params.id, normalizeGalleryPatch(body));
      return NextResponse.json({ item });
    }

    const item = await updateCompletedCommission(params.id, normalizeCompletedPatch(body));
    return NextResponse.json({ item });
  } catch (error) {
    return apiError(error);
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { collection: string; id: string } }) {
  const blocked = guardAdmin(request);
  if (blocked) return blocked;

  const collection = parseCollection(params.collection);
  if (!collection) return NextResponse.json({ error: 'Invalid collection.' }, { status: 400 });

  try {
    await deleteItem(collection, params.id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return apiError(error);
  }
}

