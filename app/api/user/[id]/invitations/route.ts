import { requireUser } from '@/guards/require-user';
import { created } from '@/lib/http/http';
import { InvitationService } from '@/lib/services/invitation';

export async function GET() {
  const { id } = await requireUser();
  const invitations = await InvitationService.getReceivedInvitations(id);
  return created(invitations);
}
