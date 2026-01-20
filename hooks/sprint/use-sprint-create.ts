import { apiRoutes } from '@/lib/routes/api-routes';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CreateSprintSchema } from '@/schemas/sprint/create-sprint-schema';
import type { SprintWithTasksWithAssigneesDTO } from '@/types/prisma/DTO/sprint';

type OptimisticSprint = {
  id: number;
  name: string;
  goal: string;
  startDate: string | null;
  endDate: string | null;
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
      const text = await res.text();
      let parsed: unknown = null;
      try {
        parsed = text ? JSON.parse(text) : null;
      } catch {
        parsed = null;
      }
      if (!res.ok) {
        const message =
          (parsed as { message?: string; error?: string } | null)?.message ||
          (parsed as { message?: string; error?: string } | null)?.error ||
          res.statusText ||
          text ||
          '';
        throw new Error(message || 'Failed to create sprint');
      }
      const data = (parsed as { data?: SprintWithTasksWithAssigneesDTO })?.data;
      return data ?? (parsed as SprintWithTasksWithAssigneesDTO);
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
        startDate: payload.startDate || null,
        endDate: payload.endDate || null,
      };
      qc.setQueryData<OptimisticSprint[]>(
        ['sprints', projectId, workspaceId],
        (old) => (old ? [...old, optimisticSprint] : [optimisticSprint])
      );

      return { previous, optimisticId: optimisticSprint.id };
    },
    onError: (_error, _vars, context) => {
      if (context?.previous) {
        qc.setQueryData(['sprints', projectId, workspaceId], context.previous);
      }
    },
    onSuccess: (
      created: SprintWithTasksWithAssigneesDTO,
      _vars,
      context
    ) => {
                                                  
      qc.setQueryData<SprintWithTasksWithAssigneesDTO[]>(
        ['sprints', projectId, workspaceId],
        (old) => {
          if (!old) return [created];
          const optimisticId = context?.optimisticId;
          if (optimisticId) {
            return old.map((s) => (s.id === optimisticId ? created : s));
          }
          return [...old, created];
        }
      );
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ['sprints', projectId, workspaceId] });
    },
  });
};
