import { apiRoutes } from '@/lib/routes/api-routes';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useWorkspaceDelete = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (workspaceId: number) => {
      const res = await fetch(apiRoutes.deleteWorkspace(workspaceId), {
        method: 'DELETE',
      });
      return res;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['workspaces'] });

    },
  });
};
