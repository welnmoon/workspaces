import { parseErrorResponse } from '@/helpers/parse-error-response';
import { apiRoutes } from '@/lib/routes/api-routes';
import { TaskStats } from '@/types/service/task-stats';
import { useQuery } from '@tanstack/react-query';

export const useTasksByStatus = (workspaceId: number, projectId: number) => {
  return useQuery({
    queryKey: ['tasks-by-status', workspaceId, projectId],
    queryFn: async () => {
      const res = await fetch(apiRoutes.getProjectTasksStats(projectId), {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!res.ok) {
        throw await parseErrorResponse(res);
      }

      const data = await res.json();

      return data.data as TaskStats;
    },
  });
};
