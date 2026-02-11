import { requirePlatformRole } from '@/guards/require-platform-role';
import { corsHeaders, withCors } from '@/helpers/with-cors';
import { proxyToNest } from '@/lib/bff/proxy-to-nest';
import { ok, serverError } from '@/lib/http/http';
import { PlatformRole } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    await requirePlatformRole([PlatformRole.SYSADMIN]);

    const res = await proxyToNest(req, '/projects');
    if (!res.ok) return withCors(res, req.headers.get('origin'));
    const projects = await res.json();
    return withCors(ok(projects), req.headers.get('origin'));
  } catch (error) {
    console.error(error);
    return withCors(
      serverError('Failed to get projects'),
      req.headers.get('origin')
    );
  }
}

export async function OPTIONS(req: Request) {
  return new NextResponse(null, {
    status: 204,
    headers: {
      ...corsHeaders(req.headers.get('origin')),
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
