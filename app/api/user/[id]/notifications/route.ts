import { requireUser } from '@/helpers/require-user';
import { ok } from '@/lib/http/http';
import { NotificationService } from '@/lib/services/notifications';

// API: get notifications
export async function GET() {
  const { id } = await requireUser();
  const notifications = await NotificationService.getNotifications(id);
  return ok(notifications);
}
