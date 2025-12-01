import { AppError } from '@/lib/errors';
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
      const raw = await res.text();
      let parsed: any = null;
      try {
        parsed = raw ? JSON.parse(raw) : null;
      } catch {
        parsed = null;
      }

      if (!res.ok) {
        const message =
          parsed?.message ||
          parsed?.error ||
          (Array.isArray(parsed?.errors)
            ? parsed.errors.map((e: any) => e?.message || String(e)).join(', ')
            : null) ||
          raw ||
          `Не удалось создать задачу: ${res.status} ${res.statusText}`;
        const code = parsed?.code ?? 'CREATE_TASK_ERROR';
        throw new AppError(res.status || 500, code, message);
      }

      return parsed;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
};
