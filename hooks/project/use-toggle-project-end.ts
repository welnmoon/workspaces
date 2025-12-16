import { apiRoutes } from '@/lib/routes/api-routes';
import { ProjectFullDTO } from '@/types/prisma/DTO/projects';
import { useMutation, useQueryClient } from '@tanstack/react-query';

type ToggleResponse = Pick<ProjectFullDTO, 'id' | 'endedAt'>;

export const useToggleProjectEnd = (
  workspaceId: number,
  projectId: number
) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const res = await fetch(
        apiRoutes.toggleProjectEnd(workspaceId, projectId),
        {
          method: 'PATCH',
        }
      );

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        const message =
          data?.message || 'Не удалось изменить статус проекта';
        throw new Error(message);
      }

      const payload = await res.json();
      return payload.data as ToggleResponse;
    },
    onMutate: async () => {
      await qc.cancelQueries({ queryKey: ['project', projectId] });
      await qc.cancelQueries({ queryKey: ['projects', workspaceId] });

      const previousProject = qc.getQueryData<ProjectFullDTO>([
        'project',
        projectId,
      ]);
      const previousList = qc.getQueryData<ProjectFullDTO[]>([
        'projects',
        workspaceId,
      ]);

      const currentEndedAt =
        previousProject?.endedAt ??
        previousList?.find((p) => p.id === projectId)?.endedAt ??
        null;
      const nextEndedAt = currentEndedAt ? null : new Date();

      qc.setQueryData<ProjectFullDTO>(['project', projectId], (old) =>
        old ? { ...old, endedAt: nextEndedAt } : old
      );

      qc.setQueryData<ProjectFullDTO[]>(['projects', workspaceId], (old) =>
        old
          ? old.map((p) =>
              p.id === projectId ? { ...p, endedAt: nextEndedAt } : p
            )
          : old
      );

      return { previousProject, previousList };
    },
    onError: (_error, _vars, context) => {
      if (context?.previousProject) {
        qc.setQueryData(['project', projectId], context.previousProject);
      }
      if (context?.previousList) {
        qc.setQueryData(['projects', workspaceId], context.previousList);
      }
    },
    onSuccess: (data) => {
      const normalizedEndedAt = data.endedAt
        ? new Date(data.endedAt)
        : null;
      qc.setQueryData<ProjectFullDTO>(['project', projectId], (old) =>
        old ? { ...old, endedAt: normalizedEndedAt } : old
      );
      qc.invalidateQueries({ queryKey: ['projects', workspaceId] });
    },
  });
};
