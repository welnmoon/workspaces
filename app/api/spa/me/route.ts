import { requirePlatformRole } from '@/guards/require-platform-role';
import { corsPreflight, withCors } from '@/helpers/with-cors';
import { handleApiError } from '@/lib/http/handle-api-error';
import { PlatformRole } from '@prisma/client';
import { NextResponse } from 'next/server';

export async function OPTIONS() {
  return corsPreflight();
}

export async function GET() {
  try {
    const user = await requirePlatformRole([PlatformRole.SYSADMIN]);

    const res = NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        platformRole: user.platformRole,
      },
    });

    return withCors(res);
  } catch (e) {
    return withCors(handleApiError(e));
  }
}
