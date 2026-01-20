import { requireWorkspaceMember } from '@/guards/workspace';
import { ok, serverError } from '@/lib/http/http';
import { MembershipService } from '@/lib/services/membership';
import { Role } from '@prisma/client';
import type { NextRequest } from 'next/server';

                                                        
                                                                                         
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ workspaceId: string; projectId: string }> }
) {
  try {
    const { workspaceId } = await params;
    const workspaceIdNumber = Number(workspaceId);

    await requireWorkspaceMember({
      workspaceId: workspaceIdNumber,
      allowed: [Role.OWNER, Role.ADMIN, Role.MEMBER],
    });

    const members =
      await MembershipService.getWorkspaceMembers(workspaceIdNumber);

    return ok(members);
  } catch (e) {
    return serverError('Failed to fetch project members', e);
  }
}
