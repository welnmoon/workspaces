import { requireUser } from '@/helpers/require-user';
import { AppError } from '@/lib/errors';
import { serverError } from '@/lib/http/http';
import { MembershipService } from '@/lib/services/membership';
import { editMemberFormSchema } from '@/schemas/member/member';
import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ memberId: string }> }
) {
  try {
    const { id } = await requireUser();
    const memberId = Number((await context.params).memberId);
    const data = await req.json();
    const res = editMemberFormSchema.safeParse(data);
    if (!res.success) {
      throw new AppError(400, 'VALIDATION_ERROR', 'Validation failed');
    }

    const updated = await MembershipService.editMemberRole(
      memberId,
      res.data.role,
      id
    );

    return NextResponse.json({
      message: 'Member role updated successfully',
      updated,
    });
  } catch (e) {
    if (e instanceof AppError) {
      return NextResponse.json(JSON.stringify({ error: e.message }), {
        status: e.status,
      });
    }

    return serverError();
  }
}
