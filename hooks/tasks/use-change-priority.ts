import { AppError } from '@/lib/errors';
import { apiRoutes } from '@/lib/routes/api-routes';
import { TaskFullDTO, TaskPriorityDTO } from '@/types/prisma/DTO/tasks';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useChangePriority = (
  workspaceId: number,
  projectId: number,
  taskId: number
) => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (priority: TaskPriorityDTO) => {
      console.log('useChangePriority:', priority);
      const res = await fetch(
        apiRoutes.changePriority(workspaceId, projectId, taskId),
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ priority }),
        }
      );

      if (!res.ok)
      {
        console.log(await res.json())
        throw new AppError(
          500,
          'CHANGE_PRIORITY_ERROR',
          'Failed to change priority'
        );
      }

      return priority;
    },
    onMutate: async (priority: TaskPriorityDTO) => {
      const key = ['tasks', projectId, workspaceId];
      await qc.cancelQueries({ queryKey: key });

      const previous = qc.getQueryData<TaskFullDTO[]>(key);

      qc.setQueryData<TaskFullDTO[] | undefined>(key, (old) =>
        old
          ? old.map((t) => (t.id === taskId ? { ...t, priority: priority } : t))
          : old
      );

      return { previous };
    },
    onError: (_error, _id, context) => {
      if (context?.previous) {
        qc.setQueryData(['tasks', projectId, workspaceId], context.previous);
      }
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ['tasks', projectId, workspaceId] });
    },
  });
};
