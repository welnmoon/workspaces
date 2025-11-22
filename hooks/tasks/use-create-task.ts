import { apiRoutes } from '@/lib/routes/api-routes';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useCreateTask = (workspaceId: number, projectId: number) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: unknown) => {
      const res = await fetch(apiRoutes.createTask(workspaceId, projectId), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      return res;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
};
