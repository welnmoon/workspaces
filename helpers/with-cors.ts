import type { NextResponse } from 'next/server';

const SPA_ORIGIN = 'https://workspaces-nyvc.vercel.app';

function normalizeOrigin(origin?: string | null) {
  return (origin ?? '').replace(/\/$/, '');
}

export function getCorsOrigin(origin?: string | null) {
  const normalized = normalizeOrigin(origin);
  if (normalized === SPA_ORIGIN) {
    return normalized;
  }
  return SPA_ORIGIN;
}

export function withCors(res: NextResponse<unknown>, origin?: string | null) {
  res.headers.set('Access-Control-Allow-Origin', getCorsOrigin(origin));
  res.headers.set('Access-Control-Allow-Credentials', 'true');
  res.headers.set('Vary', 'Origin');
  return res;
}

export function corsHeaders(origin?: string | null) {
  return {
    'Access-Control-Allow-Origin': getCorsOrigin(origin),
    'Access-Control-Allow-Credentials': 'true',
    Vary: 'Origin',
  };
}
