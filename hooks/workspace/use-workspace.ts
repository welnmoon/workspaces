import { MembershipService } from '@/lib/services/membership';
import { ProjectServices } from '@/lib/services/project';
import { TaskService } from '@/lib/services/tasks';
import { TaskStatus } from '@prisma/client';

export const useWorkspace = async (workspaceId: number) => {
  const [
    projectsCount,
    membersCount,
    tasksToDoCount,
    tasksInProgress,
    tasksDone,
    tasksTotal,
    tasksOverdue,
  ] = await Promise.all([
    ProjectServices.getCount(workspaceId),
    MembershipService.getWorkspaceMembersCount(workspaceId),
    TaskService.getWorkspaceToDoTasksCount(workspaceId, TaskStatus.TODO),
    TaskService.getWorkspaceToDoTasksCount(workspaceId, TaskStatus.IN_PROGRESS),
    TaskService.getWorkspaceToDoTasksCount(workspaceId, TaskStatus.DONE),
    TaskService.getWorkspaceToDoTasksCount(workspaceId),
    TaskService.getWorkspaceOverdueTasksCount(workspaceId),
  ]);

  return {
    projectsCount,
    membersCount,
    tasksToDoCount,
    tasksInProgress,
    tasksDone,
    tasksTotal,
    tasksOverdue,
  };
};
