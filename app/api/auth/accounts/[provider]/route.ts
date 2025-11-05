// Delete provider

import { requireUser } from '@/helpers/require-user';
import { AppError } from '@/lib/errors';
import { noContent } from '@/lib/http';
import { PROVIDER_IDS } from '@/lib/providers';
import { AuthService } from '@/lib/services/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ provider: string }> }
) {
  try {
    const { id } = await requireUser();
    const provider = (await context.params).provider.toLowerCase();

    if (!provider || !PROVIDER_IDS.includes(provider))
      throw new AppError(400, 'INVALID_PROVIDER', 'Неверный провайдер');

    await AuthService.deleteUsersAccount(id, provider);
    return noContent();
  } catch (e) {
    if (e instanceof AppError)
      return NextResponse.json(
        { code: e.code, message: e.message },
        { status: e.status }
      );
  }
}
