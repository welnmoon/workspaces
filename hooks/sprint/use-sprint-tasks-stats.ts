import { parseErrorResponse } from '@/helpers/parse-error-response';
import { apiRoutes } from '@/lib/routes/api-routes';
import { SprintTasksStatsDTO } from '@/types/prisma/DTO/sprint';
import { useQuery } from '@tanstack/react-query';

export const useSprintTasksStats = (
  workspaceId: number,
  projectId: number,
  sprintId: number
) => {
  return useQuery({
    queryKey: ['sprintTasksStats', sprintId, projectId, workspaceId],
    queryFn: async () => {
      const res = await fetch(
        apiRoutes.getSprintTasksStats(workspaceId, projectId, sprintId),
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        }
      );
      if (!res.ok) throw await parseErrorResponse(res);
      const data = await res.json();
      return data.data as SprintTasksStatsDTO;
    },
  });
};
