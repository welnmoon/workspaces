'use client';

import { WorkspaceListDTO } from '@/types/prisma/DTO/workspaces';
import WorkspaceCardClient from './w-card-client';
import { useWorkspaceMemberRole } from '@/hooks/workspace/use-workspace-member-role';

const WorkspaceCard = ({
  workspace,
  userId,
  noActions = false,
  noLink = false,
}: {
  workspace: WorkspaceListDTO;
  userId: string;
  noActions?: boolean;
  noLink?: boolean;
}) => {
  const { data: role, isLoading } = useWorkspaceMemberRole(workspace.id);

  const avatarUrl = workspace.avatarUrl;

  return (
    <WorkspaceCardClient
      noActions={noActions}
      noLink={noLink}
      userId={userId}
      avatarUrl={avatarUrl}
      workspace={workspace}
      role={role!}
      isRoleLoading={isLoading}
    />
  );
};

export default WorkspaceCard;
