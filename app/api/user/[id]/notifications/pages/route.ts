import { requireUser } from '@/helpers/require-user';
import { handleApiError } from '@/lib/http/handle-api-error';
import { badRequest, ok } from '@/lib/http/http';
import { NotificationService } from '@/lib/services/notifications';
import { NotificationPages } from '@/types/notification-pages';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { id } = await requireUser();
    const { limit, pageNumber } = await req.json();
    if (!Number.isFinite(limit) || !Number.isFinite(pageNumber))
      return badRequest('Invalid limit or page number');
    const data = await NotificationService.getNotificationPages(
      id,
      limit,
      pageNumber
    );

    return ok(data as NotificationPages);
  } catch (e) {
    return handleApiError(e);
  }
}
