import { NextResponse } from 'next/server';

const SPA_ORIGIN = process.env.VITE_URL || 'https://workspaces-nyvc.vercel.app';
const SPA_HOST = 'workspaces-nyvc.vercel.app';
const PREVIEW_HOST_PREFIX = 'workspaces-nyvc-';

function normalizeOrigin(origin?: string | null) {
  return (origin ?? '').replace(/\/$/, '');
}

function isAllowedOrigin(normalizedOrigin: string) {
  if (!normalizedOrigin) return false;
  try {
    const { host } = new URL(normalizedOrigin);
    if (host === SPA_HOST) return true;
    if (host.startsWith(PREVIEW_HOST_PREFIX) && host.endsWith('.vercel.app')) {
      return true;
    }
  } catch {
    return false;
  }
  return false;
}

export function getCorsOrigin(origin?: string | null) {
  const normalized = normalizeOrigin(origin);
  if (isAllowedOrigin(normalized)) {
    return normalized;
  }
  return SPA_ORIGIN;
}

export function withCors(res: Response, origin?: string | null) {
  const headers = new Headers(res.headers);
  headers.set('Access-Control-Allow-Origin', getCorsOrigin(origin));
  headers.set('Access-Control-Allow-Credentials', 'true');
  headers.set('Vary', 'Origin');

  return new Response(res.body, {
    status: res.status,
    statusText: res.statusText,
    headers,
  });
}

export function corsHeaders(origin?: string | null) {
  return {
    'Access-Control-Allow-Origin': getCorsOrigin(origin),
    'Access-Control-Allow-Credentials': 'true',
    Vary: 'Origin',
  };
}

export function corsPreflight() {
  const res = new NextResponse(null, { status: 204 });
  res.headers.set('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.headers.set('Access-Control-Allow-Headers', 'Content-Type');
  return withCors(res);
}
