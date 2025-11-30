'use client';

import { WorkspaceListDTO } from '@/types/prisma/DTO/workspaces';
import WorkspaceCardClient from './w-card-client';
import { useWorkspaceMemberRole } from '@/hooks/workspace/use-workspace-member-role';
import { FullRoleDTO } from '@/types/prisma/DTO/role';

const WorkspaceCard = ({
  workspace,
  userId,
}: {
  workspace: WorkspaceListDTO;
  userId: string;
}) => {
  const { data: role, isLoading } = useWorkspaceMemberRole(workspace.id);

  const avatarUrl = workspace.avatarUrl || '/images/workspace-default.png';

  return (
    <WorkspaceCardClient
      userId={userId}
      avatarUrl={avatarUrl}
      workspace={workspace}
      role={role!}
      isRoleLoading={isLoading}
    />
  );
};

export default WorkspaceCard;
