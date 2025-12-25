import { apiRoutes } from '@/lib/routes/api-routes';
import { WorkspaceListDTO } from '@/types/prisma/DTO/workspaces';
import { useQuery } from '@tanstack/react-query';

export const useWorkspaces = (initialData: WorkspaceListDTO[]) => {
  return useQuery({
    queryKey: ['workspaces'],
    initialData: initialData,
    queryFn: async () => {
      const res = await fetch(apiRoutes.getWorkspaces(), {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!res.ok) throw new Error('Failed to fetch workspaces');
      const data = await res.json();
      return data.data as WorkspaceListDTO[];
    },
  });
};
