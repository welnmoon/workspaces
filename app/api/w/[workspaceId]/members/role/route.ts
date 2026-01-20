import { requireUser } from '@/helpers/require-user';
import { ok, serverError } from '@/lib/http/http';
import { MembershipService } from '@/lib/services/membership';
import { NextRequest } from 'next/server';

                      
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ workspaceId: string }> }
) {
  try {
    const { id: userId } = await requireUser();
    const { workspaceId } = await params;
    const role = await MembershipService.getUserRoleInWorkspace(
      userId,
      Number(workspaceId)
    );

    return ok(role);
  } catch {
    return serverError('Failed to get member');
  }
}
