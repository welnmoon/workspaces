import { WorkspaceListDTO } from '@/types/prisma/DTO/workspaces';
import { MembershipService } from '@/lib/services/membership';
import WorkspaceCardClient from './w-card-client';

const WorkspaceCard = async ({
  workspace,
  userId,
}: {
  workspace: WorkspaceListDTO;
  userId: string;
}) => {
  const role = await MembershipService.getUserRoleInWorkspace(
    userId,
    workspace.id
  );

  const avatarUrl = workspace.avatarUrl || '/images/workspace-default.png';

  return (
    <WorkspaceCardClient
      avatarUrl={avatarUrl}
      workspace={workspace}
      role={role}
    />
  );
};

export default WorkspaceCard;
