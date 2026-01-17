import type { NextResponse } from 'next/server';

export function withCors(res: NextResponse<unknown>) {
  res.headers.set('Access-Control-Allow-Origin', process.env.VITE_URL!);
  res.headers.set('Access-Control-Allow-Credentials', 'true');
  res.headers.set('Vary', 'Origin');
  return res;
}
