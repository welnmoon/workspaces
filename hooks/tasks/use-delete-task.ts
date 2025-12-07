import { parseErrorResponse } from '@/helpers/parse-error-response';
import { apiRoutes } from '@/lib/routes/api-routes';
import { TaskFullDTO } from '@/types/prisma/DTO/tasks';
import { useMutation, useQueryClient } from '@tanstack/react-query';

type DeleteTaskVars = {
  taskId: number;
  sprintId?: number | null;
};

export const useDeleteTask = (workspaceId: number, projectId: number) => {
  const qc = useQueryClient();
  const tasksKey = ['tasks', projectId, workspaceId];

  return useMutation({
    mutationFn: async ({ taskId }: DeleteTaskVars) => {
      const res = await fetch(
        apiRoutes.deleteTask(workspaceId, projectId, taskId),
        { method: 'DELETE' }
      );
      if (!res.ok) throw await parseErrorResponse(res);
      return res;
    },
    onMutate: async ({ taskId, sprintId }) => {
      await qc.cancelQueries({ queryKey: tasksKey });

      const previousTasks = qc.getQueryData<TaskFullDTO[]>(tasksKey);
      const sprintKey =
        sprintId !== undefined
          ? ['sprintTasks', sprintId, projectId, workspaceId]
          : null;

      qc.setQueryData<TaskFullDTO[] | undefined>(tasksKey, (old) =>
        old ? old.filter((t) => t.id !== taskId) : old
      );

      if (sprintKey) {
        qc.setQueryData<TaskFullDTO[] | undefined>(sprintKey, (old) =>
          old ? old.filter((t) => t.id !== taskId) : old
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
    onSettled: (_data, _error, vars, context) => {
      qc.invalidateQueries({ queryKey: tasksKey });
      const sprintId = vars?.sprintId;
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
