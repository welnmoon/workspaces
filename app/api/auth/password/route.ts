import { requireUser } from '@/guards/require-user';
import { AppError } from '@/lib/errors';
import { badRequest, noContent, serverError } from '@/lib/http/http';
import { AuthService } from '@/lib/services/auth';
import { passwordChangeSchema } from '@/schemas/auth/passwrod-change-schema';
import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(req: NextRequest) {
  try {
    const { id } = await requireUser();
    const body = await req.json();
    const parsed = passwordChangeSchema.safeParse(body);
    if (!parsed.success) {
      return badRequest('Failed to change password', parsed.error.flatten());
    }

    await AuthService.updatePassword(parsed.data, id);

    return noContent();
  } catch (e) {
    console.error(e);
    if (e instanceof AppError)
      return NextResponse.json(
        { code: e.code, message: e.message },
        { status: e.status }
      );
    if (e instanceof Error && e.name === 'ZodError')
      return badRequest('Failed to change password', e.message);

    return serverError('Failed to change password', { status: 500 });
  }
}
