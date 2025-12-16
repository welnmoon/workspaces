import { apiRoutes } from '@/lib/routes/api-routes';
import { ProjectFullDTO } from '@/types/prisma/DTO/projects';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useCloseProject = (workspaceId: number, projectId: number) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const res = await fetch(apiRoutes.closeProject(workspaceId, projectId), {
        method: 'POST',
      });
      return res;
    },
    onMutate: async () => {
      await qc.cancelQueries({ queryKey: ['projects', workspaceId] });

      const previous = qc.getQueryData<ProjectFullDTO[]>([
        'projects',
        workspaceId,
      ]);

      qc.setQueryData<ProjectFullDTO[]>(['projects', workspaceId], (old) =>
        old ? old.filter((p) => p.id !== projectId) : old
      );

      return { previous };
    },
    onError(_error, _vars, context) {
      if (context?.previous) {
        qc.setQueryData(['projects', workspaceId], context.previous);
      }
    },
    onSettled: (data, error) => {
      if (!error) {
        qc.invalidateQueries({ queryKey: ['projects', workspaceId] });
      }
    },
  });
};
