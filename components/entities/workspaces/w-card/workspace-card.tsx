'use client';

import { WorkspaceListDTO } from '@/types/prisma/DTO/workspaces';
import WorkspaceCardClient from './w-card-client';
import { useWorkspaceMemberRole } from '@/hooks/workspace/use-workspace-member-role';
import { FullRoleDTO } from '@/types/prisma/DTO/role';

const WorkspaceCard = ({ workspace }: { workspace: WorkspaceListDTO }) => {
  const { data: role } = useWorkspaceMemberRole(workspace.id) as {
    data: FullRoleDTO | null;
  };

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
