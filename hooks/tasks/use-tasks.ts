import { apiRoutes } from '@/lib/routes/api-routes';
import { TaskListDTO } from '@/types/prisma/DTO/tasks';
import { useQuery } from '@tanstack/react-query';

export const useTasks = (
  projectId: number | null,
  workspaceId: number | null
) => {
  return useQuery({
    queryKey: ['tasks', projectId, workspaceId],
    enabled: !!projectId && !!workspaceId,
    queryFn: async () => {
      const res = await fetch(apiRoutes.getTasks(workspaceId!, projectId!), {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!res.ok) throw new Error('Failed to fetch tasks');
      const data = await res.json();
      return data.data as TaskListDTO[];
    },
  });
};
