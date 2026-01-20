import { parseErrorResponse } from '@/helpers/parse-error-response';
import { apiRoutes } from '@/lib/routes/api-routes';
import { TaskWithAssigneeDTO } from '@/types/prisma/DTO/tasks';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useMoveTask = (workspaceId: number, projectId: number) => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({
      taskId,
      sprintId,
    }: {
      taskId: number;
      sprintId: number | null;
    }) => {
      const res = await fetch(
        apiRoutes.moveTask(workspaceId, projectId, taskId),
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(sprintId),
        }
      );
      if (!res.ok) {
        throw await parseErrorResponse(res);
      }
      return res;
    },
    onMutate: async ({ taskId, sprintId }) => {
      qc.cancelQueries({ queryKey: ['tasks', projectId, workspaceId] });

      const previous = qc.getQueryData<TaskWithAssigneeDTO[]>([
        'tasks',
        projectId,
        workspaceId,
      ]);
      const prevSprintId =
        previous?.find((t) => t.id === taskId)?.sprintId ?? null;
      const movedTask = previous?.find((t) => t.id === taskId);

      qc.setQueryData<TaskWithAssigneeDTO[] | undefined>(
        ['tasks', projectId, workspaceId],
        (old) =>
          old ? old.map((t) => (t.id === taskId ? { ...t, sprintId } : t)) : old
      );

                                                   
      if (prevSprintId !== null) {
        qc.setQueryData<TaskWithAssigneeDTO[] | undefined>(
          ['sprintTasks', prevSprintId, projectId, workspaceId],
          (old) => (old ? old.filter((t) => t.id !== taskId) : old)
        );
      }
      if (sprintId !== null && movedTask) {
        qc.setQueryData<TaskWithAssigneeDTO[] | undefined>(
          ['sprintTasks', sprintId, projectId, workspaceId],
          (old) => {
            const updated = { ...movedTask, sprintId };
            if (!old) return [updated];
            const filtered = old.filter((t) => t.id !== taskId);
            return [...filtered, updated];
          }
        );
      }

      return { previous, prevSprintId };
    },

    onError: (_error, _vars, context) => {
      if (context?.previous) {
        qc.setQueryData(['tasks', projectId, workspaceId], context.previous);
      }
      const prevSprintId = context?.prevSprintId ?? null;
      qc.invalidateQueries({
        queryKey: ['sprintTasks', prevSprintId, projectId, workspaceId],
      });
    },

    onSettled: (_res, _err, vars, context) => {
      qc.invalidateQueries({ queryKey: ['tasks', projectId, workspaceId] });
      const newSprintId = vars?.sprintId ?? null;
      const prevSprintId = context?.prevSprintId ?? null;
      qc.invalidateQueries({
        queryKey: ['sprintTasks', newSprintId, projectId, workspaceId],
      });
      if (prevSprintId !== newSprintId) {
        qc.invalidateQueries({
          queryKey: ['sprintTasks', prevSprintId, projectId, workspaceId],
        });
      }
    },
  });
};
