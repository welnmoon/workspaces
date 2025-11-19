import { requireUser } from '@/helpers/require-user';
import { validateId } from '@/helpers/validate-id';
import { AppError } from '@/lib/errors';
import { noContent, serverError } from '@/lib/http';
import { MembershipService } from '@/lib/services/membership';
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ memberId: string }> }
) {
  try {
    const { id } = await requireUser();
    const paramsId = (await context.params).memberId;
    const memberId = validateId(paramsId);

    await MembershipService.deleteMember(memberId, id);
    return noContent();
  } catch (e) {
    if (e instanceof AppError) {
      return NextResponse.json(JSON.stringify({ error: e.message }), {
        status: e.status,
      });
    }

    return serverError('Failed to delete member', e);
  }
}
