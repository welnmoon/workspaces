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
    projectId: number;
    workspaceId: number;
  }) {
    return await prisma.task.findMany({
      where: {
        projectId,
        project: {
          workspaceId: workspaceId,
        },
      },
    });
  }
}
