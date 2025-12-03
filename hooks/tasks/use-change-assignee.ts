import { AppError } from '@/lib/errors';
import { apiRoutes } from '@/lib/routes/api-routes';
import { TaskWithAssigneeDTO } from '@/types/prisma/DTO/tasks';
import { useMutation, useQueryClient } from '@tanstack/react-query';

type ChangeAssigneeVars = {
  taskId: number;
  assigneeId: string | null;
  assignee?: TaskWithAssigneeDTO['assignee'];
};

export const useChangeTaskAssignee = (
  workspaceId: number,
  projectId: number
) => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({ taskId, assigneeId }: ChangeAssigneeVars) => {
      const res = await fetch(
        apiRoutes.changeAssignee(taskId, workspaceId, projectId),
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ assigneeId }),
        }
      );
      if (!res.ok) {
        throw new AppError(
          500,
          'CHANGE_ASSIGNEE_ERROR',
          'Failed to change assignee'
        );
      }
      return res;
    },
    onMutate: async ({ taskId, assigneeId, assignee }) => {
      qc.cancelQueries({ queryKey: ['tasks', projectId, workspaceId] });

      const previous = qc.getQueryData<TaskWithAssigneeDTO[]>([
        'tasks',
        projectId,
        workspaceId,
      ]);

      qc.setQueryData<TaskWithAssigneeDTO[] | undefined>(
        ['tasks', projectId, workspaceId],
        (old) =>
          old
            ? old.map((t) =>
                t.id === taskId
                  ? {
                      ...t,
                      assigneeId,
                      assignee: assigneeId ? assignee ?? t.assignee : null,
                    }
                  : t
              )
            : old
      );

      return { previous };
    },
    onError: (_error, _vars, context) => {
      if (context?.previous) {
        qc.setQueryData(['tasks', projectId, workspaceId], context.previous);
      }
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ['tasks', projectId, workspaceId] });
    },
  });
};
