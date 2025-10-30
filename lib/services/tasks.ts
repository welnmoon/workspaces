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
  static async getProjectTasks(projectId: number) {
    return await prisma.task.findMany({
      where: {
        projectId,
      },
    });
  }
}
