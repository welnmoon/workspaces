import { ProjectService } from '@/lib/services/project';

export const useProject = async (projectId: number) => {
  const stats = await ProjectService.getProjectTasksStats(projectId);

  return {
    stats,
  };
};
