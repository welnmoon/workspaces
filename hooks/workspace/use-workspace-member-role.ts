import { apiRoutes } from '@/lib/routes/api-routes';
import { FullRoleDTO } from '@/types/prisma/DTO/role';
import { useQuery } from '@tanstack/react-query';

export const useWorkspaceMemberRole = (workspaceId: number) => {
  return useQuery({
    queryKey: ['workspaceMemberRole', workspaceId],
    queryFn: async () => {
      const res = await fetch(apiRoutes.getWorkspaceMemberRole(workspaceId), {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!res.ok) throw new Error('Failed to fetch workspace member role');
      const data = await res.json();
      return data.data as FullRoleDTO | null;
    },
  });
};
