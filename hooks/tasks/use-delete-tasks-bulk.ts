import { AppError } from '@/lib/errors';
import { apiRoutes } from '@/lib/routes/api-routes';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useDeleteTasksBulk = (workspaceId: number, projectId: number) => {
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
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tasks', projectId, workspaceId] });
    },
  });
};
