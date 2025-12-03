import { apiRoutes } from '@/lib/routes/api-routes';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CreateSprintSchema } from '@/schemas/sprint/create-sprint-schema';
import { SprintFullDTO } from '@/types/prisma/DTO/sprint';

type OptimisticSprint = {
  id: number;
  name: string;
  goal: string;
  startDate: string;
  endDate: string;
};
export const useSprintCreate = (workspaceId: number, projectId: number) => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateSprintSchema) => {
      const res = await fetch(apiRoutes.createSprint(workspaceId, projectId), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const parsed = await res.text().catch(() => null);
        throw new Error(parsed || 'Failed to create sprint');
      }
      return res;
    },
    onMutate: async (payload) => {
      qc.cancelQueries({ queryKey: ['sprints', projectId, workspaceId] });

      const previous = qc.getQueryData<OptimisticSprint[]>([
        'sprints',
        projectId,
        workspaceId,
      ]);

      const optimisticSprint: OptimisticSprint = {
        id: Date.now(),
        name: payload.name,
        goal: payload.goal || '',
        startDate: payload.startDate || '',
        endDate: payload.endDate || '',
      };
      qc.setQueryData<OptimisticSprint[]>(
        ['sprints', projectId, workspaceId],
        (old) => (old ? [...old, optimisticSprint] : [optimisticSprint])
      );

      return { previous };
    },
    onError: (error, _vars, context) => {
      if (context?.previous) {
        qc.setQueryData(['sprints', projectId, workspaceId], context.previous);
      }
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ['sprints', projectId, workspaceId] });
    },
  });
};
