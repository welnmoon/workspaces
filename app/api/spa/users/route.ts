import { requirePlatformRole } from '@/guards/require-platform-role';
import { corsHeaders, withCors } from '@/helpers/with-cors';
import { ok, serverError } from '@/lib/http/http';
import { UserService } from '@/lib/services/user';
import { PlatformRole } from '@prisma/client';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    await requirePlatformRole([PlatformRole.SYSADMIN]);

    const users = await UserService.getUsers();
    const res = ok(users);
    return withCors(res, req.headers.get('origin'));
  } catch (e) {
    console.error(e);
    return withCors(serverError('Failed to get users'), req.headers.get('origin'));
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
