import { apiRoutes } from '@/lib/routes/api-routes';
import { ProjectListDTO } from '@/types/prisma/DTO/projects';
import { AppError } from '../../lib/errors';
import { useQuery } from '@tanstack/react-query';

export const useProjects = (
  workspaceId: number | undefined,
  initialData?: ProjectListDTO[]
) => {
  return useQuery({
    queryKey: ['projects', workspaceId],
    enabled: workspaceId !== undefined,
    initialData: initialData,
    queryFn: async () => {
      const res = await fetch(apiRoutes.getProjects(workspaceId!), {
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
      return (data.data || []) as ProjectListDTO[];
    },
  });
};
