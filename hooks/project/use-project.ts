import { parseErrorResponse } from '@/helpers/parse-error-response';
import { apiRoutes } from '@/lib/routes/api-routes';
import { ProjectFullDTO } from '@/types/prisma/DTO/projects';
import { useQuery } from '@tanstack/react-query';

export const useProject = (project: ProjectFullDTO) => {
  return useQuery({
    initialData: project,
    queryKey: ['project', project.id],
    queryFn: async () => {
      const res = await fetch(
        apiRoutes.getProject(project.workspaceId, project.id),
        { method: 'GET', headers: { 'Content-Type': 'application/json' } }
      );

      if (!res.ok) {
        parseErrorResponse(res);
      }

      const data = await res.json();

      return data.data as ProjectFullDTO;
    },
  });
};
