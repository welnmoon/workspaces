import { WorkspaceListDTO } from '@/types/prisma/DTO/workspaces';
import { apiRoutes } from '@/lib/routes/api-routes';

export const fetchWorkspaces = async (
  cache?: RequestCache
): Promise<WorkspaceListDTO[]> => {
  try {
    const res = await fetch(apiRoutes.getWorkspaces(), {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      cache,
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch workspaces: ${res.status}`);
    }

    const json = (await res.json()) as { data?: WorkspaceListDTO[] };

    return json.data ?? [];
  } catch (e) {
    console.error('Error fetching workspaces', e);
    throw e;
  }
};
