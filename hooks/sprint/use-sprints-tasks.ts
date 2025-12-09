import { apiRoutes } from '@/lib/routes/api-routes';
import { TaskWithAssigneeDTO } from '@/types/prisma/DTO/tasks';
import { useQuery } from '@tanstack/react-query';

export const useSprintTasks = (
  workspaceId: number,
  projectId: number,
  sprintId: number,
  initialTasks?: TaskWithAssigneeDTO[]
) => {
  return useQuery({
    queryKey: ['sprintTasks', sprintId, projectId, workspaceId],
    initialData: initialTasks,
    enabled: !!workspaceId && !!projectId && !!sprintId,
    queryFn: async () => {
      const res = await fetch(
        apiRoutes.getSprintTasks(workspaceId!, projectId!, sprintId!),
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        }
      );
      if (!res.ok) throw new Error('Failed to fetch sprint tasks');
      const data = await res.json();
      return (data?.data as TaskWithAssigneeDTO[]) ?? [];
    },
  });
};
