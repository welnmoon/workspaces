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

    const taskId = (await params).id;
    const res = await proxyToNest(_req, `/tasks/${taskId}`);
    if (!res.ok) return withCors(res, _req.headers.get('origin'));
    const task = await res.json();
    return withCors(ok(task), _req.headers.get('origin'));
  } catch (error) {
    console.error(error);
    return withCors(
      serverError('Failed to get task'),
      _req.headers.get('origin')
    );
  }
}

export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    await requirePlatformRole([PlatformRole.SYSADMIN]);

    const taskId = (await params).id;
    const res = await proxyToNest(req, `/tasks/${taskId}`);
    if (!res.ok) return withCors(res, req.headers.get('origin'));
    if (res.status === 204) return withCors(res, req.headers.get('origin'));
    const task = await res.json();
    return withCors(ok(task), req.headers.get('origin'));
  } catch (error) {
    console.error(error);
    return withCors(
      serverError('Failed to update task'),
      req.headers.get('origin')
    );
  }
}

export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  try {
    await requirePlatformRole([PlatformRole.SYSADMIN]);

    const taskId = (await params).id;
    const res = await proxyToNest(_req, `/tasks/${taskId}`);
    if (!res.ok) return withCors(res, _req.headers.get('origin'));
    if (res.status === 204) return withCors(res, _req.headers.get('origin'));
    const task = await res.json();
    return withCors(ok(task), _req.headers.get('origin'));
  } catch (error) {
    console.error(error);
    return withCors(
      serverError('Failed to delete task'),
      _req.headers.get('origin')
    );
  }
}

export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, {
    status: 204,
    headers: {
      ...corsHeaders(req.headers.get('origin')),
      'Access-Control-Allow-Methods': 'GET, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, Accept',
    },
  });
}
