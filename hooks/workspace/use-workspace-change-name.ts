import { AppError } from '@/lib/errors';
import { apiRoutes } from '@/lib/routes/api-routes';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useWorkspaceChangeName = (workspaceId: number) => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (newName: string) => {
      const res = await fetch(apiRoutes.changeWorkspaceName(workspaceId), {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName }),
      });

      if (!res.ok) {
        throw new AppError(
          500,
          'WORKSPACE_CHANGE_NAME_ERROR',
          'Failed to change workspace name'
        );
      }

      if (res.status === 204) return null;
      const text = await res.text();
      return text ? JSON.parse(text) : null;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['workspace', workspaceId] });
      qc.invalidateQueries({ queryKey: ['workspaces'] });
    },
  });
};
