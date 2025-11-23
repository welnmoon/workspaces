import { MembershipService } from '@/lib/services/membership';
import { TaskService } from '@/lib/services/tasks';
import { WorkspaceService } from '@/lib/services/workspace';
import { TaskStatus } from '@prisma/client';

export const getWorkspaceStats = async (workspaceId: number) => {
  const [
    projectsCount,
    membersCount,
    tasksToDoCount,
    tasksInProgress,
    tasksDone,
    tasksTotal,
    tasksOverdue,
  ] = await Promise.all([
    WorkspaceService.getProjectsCount(workspaceId),
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
