import { requireUser } from '@/helpers/require-user';
import { ok, serverError } from '@/lib/http';
import { MembershipService } from '@/lib/services/membership';
import { NextRequest } from 'next/server';

// current member role
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ workspaceId: string; id: string }> }
) {
  try {
    const { id: userId } = await requireUser();
    const { workspaceId, id } = await params;
    const role = await MembershipService.getUserRoleInWorkspace(
      userId,
      Number(workspaceId)
    );

    return ok(role);
  } catch (e) {
    return serverError('Failed to get member');
  }
}
