import { AppError } from '@/lib/errors';
import { apiRoutes } from '@/lib/routes/api-routes';
import { CreateProjectFormValues } from '@/schemas/projects/create-project-form-schemas';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useEditProject = (workspaceId: number, projectId: number) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (values: CreateProjectFormValues) => {
      const res = await fetch(apiRoutes.someProject(workspaceId, projectId), {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      const parsed = await res.text().then((t) => {
        try {
          return t ? JSON.parse(t) : null;
        } catch {
          return null;
        }
      });

      if (!res.ok) {
        const message =
          parsed?.message ||
          parsed?.error ||
          res.statusText ||
          'Failed to update project';
        const code = parsed?.code ?? 'UPDATE_PROJECT_ERROR';
        throw new AppError(500, code, message);
      }
      return true;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['projects', workspaceId] });
    },
  });
};
