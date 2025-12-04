import { AppError } from '@/lib/errors';
import { apiRoutes } from '@/lib/routes/api-routes';
import { TaskFullDTO, TaskPriorityDTO } from '@/types/prisma/DTO/tasks';
import { useMutation, useQueryClient } from '@tanstack/react-query';

type ChangePriorityVars = {
  taskId: number;
  priority: TaskPriorityDTO;
  sprintId?: number | null;
};

export const useChangePriority = (workspaceId: number, projectId: number) => {
  const qc = useQueryClient();
  const tasksKey = ['tasks', projectId, workspaceId];

  return useMutation({
    mutationFn: async ({ taskId, priority }: ChangePriorityVars) => {
      const res = await fetch(
        apiRoutes.changePriority(workspaceId, projectId, taskId),
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ priority }),
        }
      );

      if (!res.ok) {
        console.log(await res.json());
        throw new AppError(
          500,
          'CHANGE_PRIORITY_ERROR',
          'Failed to change priority'
        );
      }

      return priority;
    },
    onMutate: async ({ taskId, priority, sprintId }) => {
      await qc.cancelQueries({ queryKey: tasksKey });

      const previousTasks = qc.getQueryData<TaskFullDTO[]>(tasksKey);
      const sprintKey =
        sprintId !== undefined ? ['sprintTasks', sprintId, projectId, workspaceId] : null;

      qc.setQueryData<TaskFullDTO[] | undefined>(tasksKey, (old) =>
        old
          ? old.map((t) => (t.id === taskId ? { ...t, priority } : t))
          : old
      );

      if (sprintKey) {
        qc.setQueryData<TaskFullDTO[] | undefined>(sprintKey, (old) =>
          old
            ? old.map((t) => (t.id === taskId ? { ...t, priority } : t))
            : old
        );
      }

      return { previousTasks, sprintKey };
    },
    onError: (_error, _vars, context) => {
      if (context?.previousTasks) {
        qc.setQueryData(tasksKey, context.previousTasks);
      }
      if (context?.sprintKey) {
        qc.invalidateQueries({ queryKey: context.sprintKey });
      }
    },
    onSettled: (_data, _error, variables, context) => {
      qc.invalidateQueries({ queryKey: tasksKey });
      const sprintId = variables?.sprintId;
      if (sprintId !== undefined) {
        qc.invalidateQueries({
          queryKey: ['sprintTasks', sprintId, projectId, workspaceId],
        });
      }
      if (context?.sprintKey && sprintId === undefined) {
        qc.invalidateQueries({ queryKey: context.sprintKey });
      }
    },
  });
};
