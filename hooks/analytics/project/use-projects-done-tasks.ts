import { parseErrorResponse } from '@/helpers/parse-error-response';
import { apiRoutes } from '@/lib/routes/api-routes';
import { ProjectCompletedTasksDTO } from '@/types/prisma/DTO/projects';
import { useQuery } from '@tanstack/react-query';

export const useProjectsDoneTasks = (
  workspaceId: number,
  projectId: number,
  from?: string,
  to?: string
) => {
  return useQuery({
    queryKey: ['tasks', workspaceId, projectId],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (from) params.set('from', from);
      if (to) params.set('to', to);
      const url = `${apiRoutes.getProjectDoneTasks(workspaceId, projectId)}?${params.toString()}`;
      console.info('[useProjectsDoneTasks] fetch start', {
        workspaceId,
        projectId,
        from,
        to,
        url,
      });
      const res = await fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      console.debug('[useProjectsDoneTasks] response status', res.status);
      if (!res.ok) {
        throw await parseErrorResponse(res);
      }
      const data = await res.json();
      console.debug('[useProjectsDoneTasks] response payload', data);
      return data.data as ProjectCompletedTasksDTO[];
    },
    enabled: Boolean(workspaceId && projectId),
    initialData: [],
  });
};
