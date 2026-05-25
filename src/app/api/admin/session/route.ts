import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import {
  clearAdminCookie,
  createAdminSessionToken,
  getAdminConfigStatus,
  isAdminRequest,
  isValidAdminPassword,
  setAdminCookie,
} from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const config = getAdminConfigStatus();

  return NextResponse.json({
    authenticated: isAdminRequest(request),
    configured: config.configured,
    missing: config.missing,
  });
}

export async function POST(request: NextRequest) {
  const config = getAdminConfigStatus();

  if (!config.configured) {
    return NextResponse.json(
      {
        error: 'Admin is not configured.',
        missing: config.missing,
      },
      { status: 503 },
    );
  }

  const body = (await request.json().catch(() => null)) as { password?: string } | null;
  const password = body?.password || '';

  if (!isValidAdminPassword(password)) {
    return NextResponse.json({ error: 'Invalid password.' }, { status: 401 });
  }

  const response = NextResponse.json({ authenticated: true, configured: true, missing: [] });
  setAdminCookie(response, createAdminSessionToken());
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ authenticated: false });
  clearAdminCookie(response);
  return response;
}

