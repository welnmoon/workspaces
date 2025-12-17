import { apiRoutes } from '@/lib/routes/api-routes';
import { useQuery } from '@tanstack/react-query';

export type UserCompletedTaskClientDTO = {
  id: number;
  title: string;
  completedAt: Date | null;
  project: {
    id: number;
    name: string;
    workspace: {
      id: number;
      name: string;
    };
  };
};

type CompletedTasksResponse = {
  data?: Array<{
    id: number;
    title: string;
    completedAt: string | null;
    project: {
      id: number;
      name: string;
      workspace: {
        id: number;
        name: string;
      };
    };
  }>;
};

export const useUserCompletedTasks = (userId: string) => {
  return useQuery({
    queryKey: ['user-completed-tasks', userId],
    enabled: Boolean(userId),
    queryFn: async () => {
      const res = await fetch(`${apiRoutes.getUser(userId)}/completed-tasks`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store',
      });

      if (!res.ok) {
        throw new Error(`Failed to fetch completed tasks: ${res.status}`);
      }

      const json = (await res.json()) as CompletedTasksResponse;
      const rows = json.data ?? [];

      return rows.map(
        (t): UserCompletedTaskClientDTO => ({
          ...t,
          completedAt: t.completedAt ? new Date(t.completedAt) : null,
        })
      );
    },
    staleTime: 1000 * 60,
  });
};

