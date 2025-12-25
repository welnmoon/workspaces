import { requireUser } from '@/helpers/require-user';
import { noContent, serverError } from '@/lib/http/http';
import { NotificationService } from '@/lib/services/notifications';
import { Prisma } from '@prisma/client';
import { NextRequest } from 'next/server';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; notificationId: string }> }
) {
  try {
    await requireUser();
    const notificationId = Number((await params).notificationId);

    await NotificationService.markAsRead(notificationId);

    return noContent();
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === 'P2025') {
        return new Response(
          JSON.stringify({ message: 'Notification not found' }),
          {
            status: 404,
          }
        );
      }
    }
    return serverError('Failed to mark notification as read', e);
  }
}
