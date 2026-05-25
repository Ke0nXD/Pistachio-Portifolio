import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { getAdminConfigStatus, isAdminRequest } from '@/lib/admin-auth';
import { apiError } from '@/lib/api-errors';
import {
  createCompletedCommission,
  createGalleryItem,
  getAdminContent,
  normalizeCompletedInput,
  normalizeGalleryInput,
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

export async function GET(request: NextRequest) {
  const blocked = guardAdmin(request);
  if (blocked) return blocked;

  try {
    return NextResponse.json(await getAdminContent());
  } catch (error) {
    return apiError(error);
  }
}

export async function POST(request: NextRequest) {
  const blocked = guardAdmin(request);
  if (blocked) return blocked;

  try {
    const body = (await request.json()) as { collection?: ContentCollection; item?: unknown };

    if (body.collection === 'gallery') {
      const item = await createGalleryItem(normalizeGalleryInput(body.item));
      return NextResponse.json({ item }, { status: 201 });
    }

    if (body.collection === 'completed') {
      const item = await createCompletedCommission(normalizeCompletedInput(body.item));
      return NextResponse.json({ item }, { status: 201 });
    }

    return NextResponse.json({ error: 'Invalid collection.' }, { status: 400 });
  } catch (error) {
    return apiError(error);
  }
}

