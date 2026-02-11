import { requirePlatformRole } from '@/guards/require-platform-role';
import { corsHeaders, withCors } from '@/helpers/with-cors';
import { proxyToNest } from '@/lib/bff/proxy-to-nest';
import { ok, serverError } from '@/lib/http/http';
import { PlatformRole } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

type RouteParams = {
  params: Promise<{ id: string }>;
};

export async function GET(_req: NextRequest, { params }: RouteParams) {
  try {
    await requirePlatformRole([PlatformRole.SYSADMIN]);

    const projectId = (await params).id;
    const res = await proxyToNest(_req, `/projects/${projectId}`);
    if (!res.ok) return withCors(res, _req.headers.get('origin'));
    const project = await res.json();
    return withCors(ok(project), _req.headers.get('origin'));
  } catch (error) {
    console.error(error);
    return withCors(
      serverError('Failed to get project'),
      _req.headers.get('origin')
    );
  }
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  try {
    await requirePlatformRole([PlatformRole.SYSADMIN]);

    const projectId = (await params).id;
    const res = await proxyToNest(req, `/projects/${projectId}`);
    if (!res.ok) return withCors(res, req.headers.get('origin'));
    if (res.status === 204) return withCors(res, req.headers.get('origin'));
    const project = await res.json();
    return withCors(ok(project), req.headers.get('origin'));
  } catch (error) {
    console.error(error);
    return withCors(
      serverError('Failed to update project'),
      req.headers.get('origin')
    );
  }
}

export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  try {
    await requirePlatformRole([PlatformRole.SYSADMIN]);

    const projectId = (await params).id;
    const res = await proxyToNest(_req, `/projects/${projectId}`);
    if (!res.ok) return withCors(res, _req.headers.get('origin'));
    if (res.status === 204) return withCors(res, _req.headers.get('origin'));
    const project = await res.json();
    return withCors(ok(project), _req.headers.get('origin'));
  } catch (error) {
    console.error(error);
    return withCors(
      serverError('Failed to delete project'),
      _req.headers.get('origin')
    );
  }
}

export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, {
    status: 204,
    headers: {
      ...corsHeaders(req.headers.get('origin')),
      'Access-Control-Allow-Methods': 'GET, PUT, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, Accept',
    },
  });
}
