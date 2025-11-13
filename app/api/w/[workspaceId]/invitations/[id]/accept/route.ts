import { requireUser } from '@/helpers/require-user';
import { AppError } from '@/lib/errors';
import { InvitationService } from '@/lib/services/invitation';
import { NextRequest, NextResponse } from 'next/server';

type Params = { params: Promise<{ id: string }> };

// Accept by ID
export async function POST(req: NextRequest, context: Params) {
  try {
    const { id } = await requireUser();
    const invId = (await context.params).id;
    const invIdNumber = Number(invId);

    if (Number.isNaN(invIdNumber))
      throw new AppError(404, 'INVITATION_NOT_FOUND', 'Приглашение не найдено');

    await InvitationService.acceptInvitationById({
      invId: invIdNumber,
      userId: id,
    });
    return NextResponse.json({});
  } catch (e) {
    if (e instanceof AppError)
      return NextResponse.json(
        { code: e.code, message: e.message },
        { status: e.status }
      );

    console.error(e);
    return NextResponse.json({
      code: 500,
      message: 'Failed to accept invitation',
    });
  }
}
