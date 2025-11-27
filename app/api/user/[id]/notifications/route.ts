import { requireUser } from '@/helpers/require-user';
import { created, ok } from '@/lib/http';
import { InvitationService } from '@/lib/services/invitation';
import { NotificationService } from '@/lib/services/notifications';

// API: get notifications
export async function GET() {
  const { id } = await requireUser();
  const notifications = await NotificationService.getNotifications(id);
  return ok(notifications);
}
