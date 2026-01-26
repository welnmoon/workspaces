import { apiRoutes } from '@/lib/routes/api-routes';
import { ProjectCompletedTaskVsCreatedDTO } from '@/types/prisma/DTO/projects';
import { useQuery } from '@tanstack/react-query';

export const useCreatedVsCompletedTasks = (
  workspaceId: number,
  projectId: number,
  from?: string,
  to?: string
) => {
  return useQuery({
    queryKey: ['createdVsCompletedTasks', workspaceId, projectId, from, to],
    enabled: !!workspaceId && !!projectId,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const params = new URLSearchParams();
      if (from) params.set('from', from);
      if (to) params.set('to', to);
      const url = `${apiRoutes.getProjectCreatedVsCompletedTasks(workspaceId, projectId)}?${params.toString()}`;

      const res = await fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!res.ok) throw new Error('Failed to fetch tasks');
      const data = await res.json();
      return data.data as ProjectCompletedTaskVsCreatedDTO;
    },
  });
};
