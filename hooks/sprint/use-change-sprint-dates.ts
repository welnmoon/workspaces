import { parseErrorResponse } from '@/helpers/parse-error-response';
import { apiRoutes } from '@/lib/routes/api-routes';
import { SprintFullDTO } from '@/types/prisma/DTO/sprint';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useChangeSprintDates = (
  workspaceId: number,
  projectId: number,
  sprintId: number
) => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (payload: {
      startDate: string | undefined;
      endDate: string | undefined;
    }) => {
      const res = await fetch(
        apiRoutes.changeSprintDates(workspaceId, projectId, sprintId),
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      );
      if (!res.ok) throw await parseErrorResponse(res);
      return res;
    },
    onMutate: async (payload: {
      startDate: string | undefined;
      endDate: string | undefined;
    }) => {
      await qc.cancelQueries({ queryKey: ['sprints', projectId, workspaceId] });

      const previous = qc.getQueryData<SprintFullDTO[]>([
        'sprints',
        projectId,
        workspaceId,
      ]);

      qc.setQueryData<SprintFullDTO[] | undefined>(
        ['sprints', projectId, workspaceId],
        (old) => {
          if (!old) return old;

          return old.map((s) =>
            s.id === sprintId
              ? {
                  ...s,
                  startDate: payload.startDate
                    ? new Date(payload.startDate)
                    : null,
                  endDate: payload.endDate ? new Date(payload.endDate) : null,
                }
              : s
          );
        }
      );
      return { previous };
    },
    onError: (_err, _payload, context) => {
      if (context?.previous) {
        qc.setQueryData(['sprints', projectId, workspaceId], context.previous);
      }
    },

    onSettled: () => {
      qc.invalidateQueries({ queryKey: ['sprints', projectId, workspaceId] });
    },
  });
};
