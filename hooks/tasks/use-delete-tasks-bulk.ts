import { AppError } from '@/lib/errors';
import { apiRoutes } from '@/lib/routes/api-routes';
import { TaskWithAssigneeDTO } from '@/types/prisma/DTO/tasks';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Dispatch, SetStateAction } from 'react';

export const useDeleteTasksBulk = (
  workspaceId: number,
  projectId: number,
  setAllTasks: Dispatch<SetStateAction<TaskWithAssigneeDTO[]>>,
  queryKey: (string | number)[]
) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (ids: Set<number>) => {
      const idsArray = Array.from(ids);
      const res = await fetch(apiRoutes.deleteTasksBulk(), {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          deleteTasksIds: idsArray,
          workspaceId,
          projectId,
        }),
      });

      if (!res.ok) {
        const payload = await res.json();
        const message = payload?.message || 'Не удалось удалить задачи';
        throw new AppError(
          res.status || 500,
          'DELETE_TASKS_BULK_ERROR',
          message
        );
      }
      return true;
    },
    onMutate: async (ids) => {
      await qc.cancelQueries({ queryKey });

      const previous = qc.getQueryData<TaskWithAssigneeDTO[]>(queryKey) ?? [];

      const idSet = new Set(ids);
      const next = previous.filter((t) => !idSet.has(t.id));

      setAllTasks(next);
      qc.setQueryData(queryKey, next);

      return { previous };
    },
    onError: (error, _ids, context) => {
      if (context?.previous) {
        setAllTasks(context.previous);
        qc.setQueryData(queryKey, context.previous);
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey });
    },
  });
};
