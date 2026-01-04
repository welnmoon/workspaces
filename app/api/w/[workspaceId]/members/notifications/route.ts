import { requireWorkspaceMember } from '@/guards/workspace';
import { validateId } from '@/helpers/validate-id';
import { AppError } from '@/lib/errors';
import { badRequest, ok, serverError, unprocessable } from '@/lib/http/http';
import { NotificationService } from '@/lib/services/notifications';
import { sendNotificationToWMembersSchema } from '@/schemas/notification/send-notification-to-w-members-schema';
import { Prisma, Role } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { ZodError } from 'zod';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ workspaceId: string }> }
) {
  try {
    const workspaceId = validateId((await params).workspaceId);

    const { user } = await requireWorkspaceMember({
      workspaceId,
      allowed: [Role.OWNER, Role.ADMIN],
    });

    const res = sendNotificationToWMembersSchema.safeParse(await req.json());
    if (!res.success) return unprocessable(res.error.message);

    const { title, body } = res.data;

    await NotificationService.sendNotificationToWMembers(
      workspaceId,
      title,
      body,
      user.id
    );

    return ok('Notification sent successfully');
  } catch (e) {
    if (e instanceof AppError) {
      if (e.status === 422) return unprocessable(e.message);
      if (e.status === 400) return badRequest(e.message);

      return NextResponse.json(
        { code: e.code, message: e.message },
        { status: e.status ?? 400 }
      );
    }
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      return NextResponse.json(e.message, { status: 400 });
    }
    if (e instanceof ZodError) return unprocessable(e.message, e.issues);

    return serverError('Failed to send notification', e);
  }
}
