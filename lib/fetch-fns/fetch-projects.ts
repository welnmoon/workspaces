import { apiRoutes } from '@/lib/routes/api-routes';
import { ProjectListDTO } from '@/types/prisma/DTO/projects';
import { AppError } from '../errors';
import { useQuery } from '@tanstack/react-query';

export const fetchProjects = async (
  workspaceId: number
): Promise<ProjectListDTO[]> => {
  try {
    const res = await fetch(apiRoutes.getProjects(workspaceId), {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!res.ok) {
      throw new AppError(
        500,
        'FETCH_PROJECTS_ERROR',
        'Ошибка при получении проектов'
      );
    }

    const json = (await res.json()) as { data?: ProjectListDTO[] };

    return json.data ?? [];
  } catch (e) {
    if (e instanceof AppError) {
      console.error(e);
      throw e;
    }
    console.error(e);
    throw new AppError(
      500,
      'FETCH_PROJECTS_ERROR',
      'Ошибка при получении проектов'
    );
  }
};

export const useProjects = (workspaceId: number) => {
  return useQuery({
    queryKey: ['projects', workspaceId], // workspaceId - добавляем что бы при изменении workspace запрос обновлялся
    queryFn: async () => {
      const res = await fetch(apiRoutes.getProjects(workspaceId), {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!res.ok) {
        throw new AppError(
          500,
          'FETCH_PROJECTS_ERROR',
          'Ошибка при получении проектов'
        );
      }

      const data = await res.json();
      return data.data as ProjectListDTO[];
    },
  });
};
