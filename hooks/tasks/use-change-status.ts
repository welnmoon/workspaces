import { updateTaskStatusRequest } from './use-task-status-change';
import { TaskStatusDTO } from '@/const/tasks-status';
import { TaskFullDTO } from '@/types/prisma/DTO/tasks';
import { useMutation, useQueryClient } from '@tanstack/react-query';

type ChangeStatusVars = {
  taskId: number;
  status: TaskStatusDTO;
  sprintId?: number | null;
};

export const useChangeStatus = (workspaceId: number, projectId: number) => {
  const qc = useQueryClient();
  const tasksKey = ['tasks', projectId, workspaceId];

  return useMutation({
    mutationFn: ({ taskId, status }: ChangeStatusVars) =>
      updateTaskStatusRequest(taskId, status),
    onMutate: async ({ taskId, status, sprintId }) => {
      await qc.cancelQueries({ queryKey: tasksKey });
      const previousTasks = qc.getQueryData<TaskFullDTO[]>(tasksKey);
      const sprintKey =
        sprintId !== undefined
          ? ['sprintTasks', sprintId, projectId, workspaceId]
          : null;

      qc.setQueryData<TaskFullDTO[] | undefined>(tasksKey, (old) =>
        old ? old.map((t) => (t.id === taskId ? { ...t, status } : t)) : old
      );

      if (sprintKey) {
        qc.setQueryData<TaskFullDTO[] | undefined>(sprintKey, (old) =>
          old ? old.map((t) => (t.id === taskId ? { ...t, status } : t)) : old
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
