import { NextRequest } from 'next/server';

const NEST_API_URL = process.env.NEST_API_URL!;

export const proxyToNest = async (req: NextRequest, nestPath: string) => {
  const target = new URL(nestPath, NEST_API_URL);
  target.search = req.nextUrl.search;

  const headers = new Headers(req.headers);
  headers.delete('host');
  headers.delete('content-length');
  headers.delete('connection');

  const hasBody = req.method !== 'GET' && req.method !== 'HEAD';

  const init: RequestInit & { duplex?: 'half' } = {
    method: req.method,
    headers,
    body: hasBody ? req.body : undefined,
  };

  if (hasBody) {
    init.duplex = 'half';
  }

  return fetch(target, init);
};
