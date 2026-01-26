import { parseErrorResponse } from '@/helpers/parse-error-response';
import { apiRoutes } from '@/lib/routes/api-routes';
import { SLA } from '@/types/prisma/DTO/projects';
import { useQuery } from '@tanstack/react-query';

export const useSLATasks = (workspaceId: number, projectId: number) => {
  return useQuery({
    queryKey: ['sla-tasks', workspaceId, projectId],
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const res = await fetch(
        apiRoutes.getProjectSLATasks(workspaceId, projectId),
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        }
      );
      if (!res.ok) throw await parseErrorResponse(res);
      const data = await res.json();
      return data.data as SLA;
    },
  });
};
