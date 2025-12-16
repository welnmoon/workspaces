import { apiRoutes } from '@/lib/routes/api-routes';
import { TaskStats } from '@/types/service/task-stats';
import { useQuery } from '@tanstack/react-query';

export const useProjectStats = (projectId: number) => {
  return useQuery({
    queryKey: ['project', projectId],
    queryFn: async (): Promise<TaskStats> => {
      const res = await fetch(apiRoutes.getProjectTasksStats(projectId), {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!res.ok) throw new Error('Failed to fetch project');
      const data = await res.json();
      return data.data as TaskStats;
    },
  });
};
