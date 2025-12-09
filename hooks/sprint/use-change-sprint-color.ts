import { apiRoutes } from '@/lib/routes/api-routes';
import { SprintColorDTO, SprintFullDTO } from '@/types/prisma/DTO/sprint';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useChangeSprintColor = (
  workspaceId: number,
  projectId: number,
  sprintId: number
) => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (color: SprintColorDTO) => {
      const res = await fetch(
        apiRoutes.changeSprintColor(workspaceId, projectId, sprintId),
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ color }),
        }
      );
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        const message = data?.message || 'Не удалось изменить цвет спринта';
        throw new Error(message);
      }
      return res;
    },
    onMutate: async (color: SprintColorDTO) => {
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

          return old.map((s) => (s.id === sprintId ? { ...s, color } : s));
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
