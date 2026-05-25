import { createHmac, timingSafeEqual } from 'crypto';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const adminCookieName = 'pistachio_admin_session';
const sessionMaxAgeSeconds = 60 * 60 * 8;

export function getAdminConfigStatus() {
  const missing: string[] = [];
  if (!process.env.ADMIN_PASSWORD) missing.push('ADMIN_PASSWORD');
  if (!process.env.ADMIN_SESSION_SECRET) missing.push('ADMIN_SESSION_SECRET');

  return {
    configured: missing.length === 0,
    missing,
  };
}

function getSecret() {
  return process.env.ADMIN_SESSION_SECRET || '';
}

function sign(value: string) {
  return createHmac('sha256', getSecret()).update(value).digest('base64url');
}

function safeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  if (leftBuffer.length !== rightBuffer.length) return false;
  return timingSafeEqual(leftBuffer, rightBuffer);
}

export function isValidAdminPassword(password: string) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  return safeEqual(password, expected);
}

export function createAdminSessionToken() {
  const expiresAt = String(Date.now() + sessionMaxAgeSeconds * 1000);
  return `${expiresAt}.${sign(expiresAt)}`;
}

export function verifyAdminSessionToken(token?: string) {
  const config = getAdminConfigStatus();
  if (!config.configured || !token) return false;

  const [expiresAt, signature] = token.split('.');
  if (!expiresAt || !signature) return false;
  if (Number(expiresAt) < Date.now()) return false;

  const expectedSignature = sign(expiresAt);
  return safeEqual(signature, expectedSignature);
}

export function isAdminRequest(request: NextRequest) {
  return verifyAdminSessionToken(request.cookies.get(adminCookieName)?.value);
}

export function setAdminCookie(response: NextResponse, token: string) {
  response.cookies.set({
    name: adminCookieName,
    value: token,
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: sessionMaxAgeSeconds,
  });
}

export function clearAdminCookie(response: NextResponse) {
  response.cookies.set({
    name: adminCookieName,
    value: '',
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0,
  });
}

