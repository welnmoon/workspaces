import { Prisma, TaskPriority, TaskStatus } from '@prisma/client';
import { prisma } from '../prisma';
import { AppError } from '../errors';

export class TaskService {
  static async getAll(projectId: number) {
    return await prisma.task.findMany({
      where: {
        projectId,
      },
    });
  }

  static async getTaskById(taskId: number) {
    return await prisma.task.findUnique({
      where: {
        id: taskId,
      },
    });
  }
  static async getAllWithAssignees(projectId: number) {
    return await prisma.task.findMany({
      where: {
        projectId,
      },
      include: {
        assignee: true,
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
    priority,
    sprintId,
  }: {
    projectId: number;
    title: string;
    description: string | undefined;
    dueDate?: string;
    assigneeId: string | undefined;
    priority: TaskPriority;
    sprintId: number | null;
  }) {
    let parsedDueDate: Date | undefined = undefined;

    if (dueDate) {
      const d = new Date(dueDate);
      if (isNaN(d.getTime())) {
        throw new AppError(
          400,
          'INVALID_DUE_DATE',
          'Укажите корректный дедлайн'
        );
      }
      parsedDueDate = d;
    }

    const existing = await prisma.task.findFirst({
      where: {
        projectId: Number(projectId),
        sprintId: sprintId,
        title: {
          equals: title,
          mode: 'insensitive',
        },
      },
    });

    if (existing) {
      throw new AppError(
        409,
        'TASK_ALREADY_EXISTS',
        'Задача с таким названием уже есть в проекте'
      );
    }

    const task = await prisma.task.create({
      data: {
        title,
        description: description || 'Без описания',
        dueDate: parsedDueDate,
        projectId: Number(projectId),
        assigneeId,
        priority: priority || TaskPriority.LOW,
        sprintId,
      },
    });

    return task;
  }

  static async deleteTasksBulk(ids: number[], workspaceId: number) {
    return await prisma.task.deleteMany({
      where: {
        id: {
          in: ids,
        },
        project: {
          workspaceId,
        },
      },
    });
  }

  static async changePriority(taskId: number, priority: TaskPriority) {
    try {
      const updated = await prisma.task.update({
        where: {
          id: taskId,
        },
        data: {
          priority,
        },
      });

      console.log('SERVICE', updated);

      return updated;
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2025'
      ) {
        throw new AppError(404, 'TASK_NOT_FOUND', 'Задача не найдена');
      }

      throw e;
    }
  }

  static async changeAssignee(
    projectId: number,
    taskId: number,
    assigneeId: string | null
  ) {
    return await prisma.task.update({
      where: {
        id: taskId,
      },
      data: {
        assigneeId,
      },
    });
  }

  static async moveTask(
    taskId: number,
    sprintId: number | null,
    projectId: number
  ) {
    const current = await prisma.task.findUnique({
      where: { id: taskId },
      select: { title: true, projectId: true },
    });

    if (!current || current.projectId !== projectId) {
      throw new AppError(404, 'TASK_NOT_FOUND', 'Задача не найдена');
    }

    const taskExistInNewSprint = await prisma.task.findFirst({
      where: {
        projectId,
        sprintId,
        title: { equals: current.title, mode: 'insensitive' },
        NOT: { id: taskId },
      },
    });
    if (taskExistInNewSprint) {
      throw new AppError(
        409,
        'TASK_ALREADY_EXISTS_IN_NEW_SPRINT',
        'Задача уже существует в новом спринте'
      );
    }
    return await prisma.task.update({
      where: {
        id: taskId,
      },
      data: {
        sprintId,
      },
    });
  }

  static async deleteTask(taskId: number, projectId: number) {
    const task = await prisma.task.findUnique({
      where: { id: taskId },
      select: { projectId: true },
    });

    if (!task || task.projectId !== projectId) {
      throw new AppError(404, 'TASK_NOT_FOUND', 'Задача не найдена');
    }

    return prisma.task.delete({
      where: { id: taskId },
    });
  }
}
