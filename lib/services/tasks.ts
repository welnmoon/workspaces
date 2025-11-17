import { TaskStatus } from '@prisma/client';
import prisma from '../prisma';
import { AppError } from '../errors';

export class TaskService {
  static async getAll(projectId: number) {
    return await prisma.task.findMany({
      where: {
        projectId,
      },
    });
  }
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
  static async getWorkspaceToDoTasksCount(
    workspaceId: number,
    status?: TaskStatus
  ) {
    if (!status) {
      return await prisma.task.count({
        where: {
          project: {
            workspaceId,
          },
        },
      });
    }
    return await prisma.task.count({
      where: {
        project: {
          workspaceId,
        },
        status,
      },
    });
  }
  static async getWorkspaceOverdueTasksCount(workspaceId: number) {
    return await prisma.task.count({
      where: {
        project: {
          workspaceId,
        },
        dueDate: {
          lt: new Date(),
        },
      },
    });
  }
  static async updateTaskStatus(
    taskId: number,
    status: TaskStatus,
    userId: string
  ) {
    const task = await prisma.task.findUnique({
      where: {
        id: taskId,
      },
    });

    if (!task) {
      throw new AppError(404, 'TASK_NOT_FOUND', 'Задача не найдена');
    }

    const w = await prisma.workspace.findFirst({
      where: {
        projects: {
          some: {
            tasks: {
              some: {
                id: taskId,
              },
            },
          },
        },
      },
    });

    if (!w)
      throw new AppError(404, 'WORKSPACE_NOT_FOUND', 'Пространство не найдено');

    if (task?.assigneeId !== userId && userId !== w.ownerId)
      throw new AppError(403, 'NOT_PERMITTED', 'Недостаточно прав');

    return await prisma.task.update({
      where: {
        id: taskId,
      },
      data: {
        status,
      },
    });
  }

  static async createTask({
    projectId,
    title,
    description,
    dueDate,
    assigneeId,
  }: {
    projectId: number;
    title: string;
    description: string | undefined;
    dueDate: string;
    assigneeId: string | undefined;
  }) {
    if (!description) description = 'No description';
    await prisma.task.create({
      data: {
        title: title,
        description: description,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        projectId: Number(projectId),
        assigneeId,
      },
    });
  }
}
