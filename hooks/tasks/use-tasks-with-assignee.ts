import { apiRoutes } from '@/lib/routes/api-routes';
import { TaskWithAssigneeDTO } from '@/types/prisma/DTO/tasks';
import { useQuery } from '@tanstack/react-query';

export const useTasksWithAssignee = (
  projectId: number | undefined,
  workspaceId: number | undefined,
  tasks?: TaskWithAssigneeDTO[]
) => {
  return useQuery({
    queryKey: ['tasks', projectId, workspaceId],
    initialData: tasks || [],
    enabled: !!projectId && !!workspaceId,
    queryFn: async () => {
      const res = await fetch(
        apiRoutes.getTasksWithAssignee(workspaceId!, projectId!),
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        }
      );

      if (!res.ok) throw new Error('Failed to fetch tasks');
      const data = await res.json();
      return data.data as TaskWithAssigneeDTO[];
    },
  });
};
