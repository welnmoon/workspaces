import { apiRoutes } from '@/lib/routes/api-routes';
import { ProjectListDTO } from '@/types/prisma/DTO/projects';

export const fetchProjects = async (
  workspaceId: number
): Promise<ProjectListDTO[]> => {
  try {
    const res = await fetch(apiRoutes.getProjects(workspaceId), {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch projects: ${res.status}`);
    }

    const json = (await res.json()) as { data?: ProjectListDTO[] };

    return json.data ?? [];
  } catch (e) {
    console.error('Error fetching projects', e);
    throw e;
  }
};
