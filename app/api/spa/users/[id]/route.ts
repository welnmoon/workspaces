import { requirePlatformRole } from '@/guards/require-platform-role';
import { corsHeaders, withCors } from '@/helpers/with-cors';
import { proxyToNest } from '@/lib/bff/proxy-to-nest';
import { noContent, ok, serverError } from '@/lib/http/http';
import { UserService } from '@/lib/services/user';
import { PlatformRole } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requirePlatformRole([PlatformRole.SYSADMIN]);

    const id = (await params).id;
    // const user = await UserService.getUserById(id);
    // const res = ok(user);
    // return withCors(res, _req.headers.get('origin'));
    const res = await proxyToNest(req, `/users/${id}`);
    if (!res.ok) return withCors(res, res.headers.get('origin'));
    const user = await res.json();
    return withCors(ok(user), req.headers.get('origin'));
  } catch (e) {
    console.error(e);
    return withCors(
      serverError('Failed to update user'),
      req.headers.get('origin')
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requirePlatformRole([PlatformRole.SYSADMIN]);

    const id = (await params).id;
    // const user = await req.json();
    // const updatedUser = await UserService.updateUser(id, user);
    // const res = ok(updatedUser);
    // return withCors(res, req.headers.get('origin'));
    const res = await proxyToNest(req, `/users/${id}`);
    if (!res.ok) {
      console.log(res.statusText, res.status, res.text);
      return withCors(res, res.headers.get('origin'));
    }
    const user = await res.json();
    return withCors(ok(user), req.headers.get('origin'));
  } catch (e) {
    console.error(e);
    return withCors(
      serverError('Failed to update user'),
      req.headers.get('origin')
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requirePlatformRole([PlatformRole.SYSADMIN]);

    const id = (await params).id;
    // await UserService.deleteUser(id);
    // return withCors(noContent(), _req.headers.get('origin'));
    const res = await proxyToNest(req, `/users/${id}`);
    if (!res.ok) return withCors(res, res.headers.get('origin'));
    const user = await res.json();
    return withCors(ok(user), req.headers.get('origin'));
  } catch (e) {
    console.error(e);
    return withCors(
      serverError('Failed to delete user'),
      req.headers.get('origin')
    );
  }
}

export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, {
    status: 204,
    headers: {
      ...corsHeaders(req.headers.get('origin')),
      'Access-Control-Allow-Methods': 'GET, OPTIONS, PUT, DELETE',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, Accept',
    },
  });
}
