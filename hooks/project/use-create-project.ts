import { checkResponse } from '@/helpers/check-response';
import { apiRoutes } from '@/lib/routes/api-routes';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useCreateProject = (workspaceId: number) => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (payload: unknown) => {
      const res = await fetch(apiRoutes.createProject(workspaceId), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      await checkResponse(res);

      return await res.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['projects', workspaceId] });
    },
  });
};
