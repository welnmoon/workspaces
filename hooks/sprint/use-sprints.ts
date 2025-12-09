import { apiRoutes } from '@/lib/routes/api-routes';
import { SprintWithTasksWithAssigneesDTO } from '@/types/prisma/DTO/sprint';
import { useQuery } from '@tanstack/react-query';

export const useSprints = (
  workspaceId: number | undefined,
  projectId: number | undefined,
  initialData?: SprintWithTasksWithAssigneesDTO[]
) => {
  return useQuery({
    queryKey: ['sprints', projectId, workspaceId],
    
    initialData,
    enabled: !!workspaceId && !!projectId,
    queryFn: async () => {
      const res = await fetch(apiRoutes.getSprints(workspaceId!, projectId!), {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!res.ok) throw new Error('Failed to fetch sprints');
      const data = await res.json();
      return (data?.data as SprintWithTasksWithAssigneesDTO[]) ?? [];
    },
  });
};
