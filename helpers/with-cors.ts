import type { NextResponse } from 'next/server';

export function withCors(res: NextResponse<unknown>) {
  res.headers.set('Access-Control-Allow-Origin', 'https://workspaces-nyvc.vercel.app');
  res.headers.set('Access-Control-Allow-Credentials', 'true');
  res.headers.set('Vary', 'Origin');
  return res;
}
