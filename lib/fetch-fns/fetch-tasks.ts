import { apiRoutes } from '@/lib/routes/api-routes';
import { TaskListDTO } from '@/types/prisma/DTO/tasks';

export const fetchTasks = async ({
  workspaceId,
  projectId,
}: {
  workspaceId: number;
  projectId: number;
}): Promise<TaskListDTO[]> => {
  try {
    const res = await fetch(apiRoutes.getTasks(workspaceId, projectId), {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch tasks: ${res.status}`);
    }

    const json = (await res.json()) as { data?: TaskListDTO[] };

    return json.data ?? [];
  } catch (e) {
    console.error('Error fetching tasks', e);
    throw e;
  }
};
