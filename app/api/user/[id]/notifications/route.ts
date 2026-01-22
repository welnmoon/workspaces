import { requireUser } from '@/guards/require-user';
import { ok } from '@/lib/http/http';
import { NotificationService } from '@/lib/services/notifications';

export async function GET() {
  const { id } = await requireUser();
  const notifications = await NotificationService.getNotifications(id);
  return ok(notifications);
}
