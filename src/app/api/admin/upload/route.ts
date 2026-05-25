import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { getAdminConfigStatus, isAdminRequest } from '@/lib/admin-auth';
import { apiError } from '@/lib/api-errors';
import { ContentStoreError } from '@/lib/content-store';
import { uploadImageToSupabase } from '@/lib/supabase-storage';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

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

export async function POST(request: NextRequest) {
  const blocked = guardAdmin(request);
  if (blocked) return blocked;

  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!(file instanceof File)) {
      throw new ContentStoreError('Upload file is required.', 400);
    }

    const url = await uploadImageToSupabase(file, formData.get('folder'));
    return NextResponse.json({ url });
  } catch (error) {
    return apiError(error);
  }
}

