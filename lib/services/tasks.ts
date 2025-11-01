import prisma from '../prisma';

export class TaskService {
  static async getList(userId: string) {
    return await prisma.task.findMany({
      where: {
        assigneeId: userId,
      },
      select: {
        description: true,
        dueDate: true,
        priority: true,
        status: true,
        title: true,
        projectId: true,
        project: {
          select: {
            name: true,
          },
        },
      },
    });
  }
  static async getProjectTasks({
    projectId,
    workspaceId,
  }: {
    projectId: number | string;
    workspaceId: number | string;
  }) {
    const numberProjectId = Number(projectId);
    const numberWorkspaceId = Number(workspaceId);
    if (
      Number.isNaN(numberProjectId) ||
      Number.isNaN(numberWorkspaceId)
    ) {
      throw new Error('Invalid ID');
    }
    return await prisma.task.findMany({
      where: {
        projectId: numberProjectId,
        project: {
          workspaceId: numberWorkspaceId,
        },
      },
    });
  }
}
