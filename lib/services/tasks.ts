import {
  AuditActions,
  Prisma,
  TaskPriority,
  TaskStatus,
} from '@prisma/client';
import logger from '../logger';
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
      include: {
        project: {
          select: {
            workspaceId: true,
            workspace: {
              select: {
                ownerId: true,
              },
            },
          },
        },
      },
    });

    if (!task) {
      throw new AppError(404, 'TASK_NOT_FOUND', 'Задача не найдена');
    }

    const workspaceOwnerId = task.project?.workspace?.ownerId ?? null;
    const workspaceId = task.project?.workspaceId;

    if (!workspaceId) {
      throw new AppError(404, 'WORKSPACE_NOT_FOUND', 'Пространство не найдено');
    }

    if (task.assigneeId !== userId && userId !== workspaceOwnerId)
      throw new AppError(403, 'NOT_PERMITTED', 'Недостаточно прав');

    const completedAt =
      status === 'DONE' ? (task.completedAt ?? new Date()) : null;

    logger.info(
      `[TaskService.updateTaskStatus] task=${taskId} status ${task.status} -> ${status} completedAt=${completedAt?.toISOString() ?? 'null'}`
    );

    const updatedTask = await prisma.task.update({
      where: {
        id: taskId,
      },
      data: {
        status,
        completedAt,
      },
    });

    await writeTaskAuditLog({
      userId,
      workspaceId,
      projectId: task.projectId,
      taskId,
      action: AuditActions.TASK_STATUS_CHANGED,
      details: { from: task.status, to: status },
    });

    return updatedTask;
  }

  static async createTask({
    projectId,
    title,
    description,
    dueDate,
    assigneeId,
    priority,
    sprintId,
    actorId,
  }: {
    projectId: number;
    title: string;
    description: string | undefined;
    dueDate?: string;
    assigneeId: string | undefined;
    priority: TaskPriority;
    sprintId: number | null;
    actorId: string;
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

    const project = await prisma.project.findUnique({
      where: { id: Number(projectId) },
      select: { workspaceId: true },
    });

    if (!project) {
      throw new AppError(404, 'PROJECT_NOT_FOUND', 'Проект не найден');
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

    await writeTaskAuditLog({
      userId: actorId,
      workspaceId: project.workspaceId,
      projectId: task.projectId,
      taskId: task.id,
      action: AuditActions.CREATE,
      details: { title: task.title, assigneeId },
    });

    return task;
  }

  static async deleteTasksBulk(
    ids: number[],
    workspaceId: number,
    actorId: string
  ) {
    const deleted = await prisma.task.deleteMany({
      where: {
        id: {
          in: ids,
        },
        project: {
          workspaceId,
        },
      },
    });

    if (deleted.count > 0) {
      await prisma.auditLog.create({
        data: {
          userId: actorId,
          workspaceId,
          action: AuditActions.DELETE,
          entityType: 'TASK',
          entityId: ids.join(','),
          details: JSON.stringify({ deletedIds: ids }),
        },
      });
    }

    return deleted;
  }

  static async changePriority(
    taskId: number,
    priority: TaskPriority,
    actorId: string
  ) {
    try {
      const updated = await prisma.task.update({
        where: {
          id: taskId,
        },
        data: {
          priority,
        },
        select: {
          id: true,
          title: true,
          projectId: true,
          project: { select: { workspaceId: true } },
        },
      });

      console.log('SERVICE', updated);

      await writeTaskAuditLog({
        userId: actorId,
        workspaceId: updated.project.workspaceId,
        projectId: updated.projectId,
        taskId,
        action: AuditActions.UPDATE,
        details: { priority },
      });

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
    assigneeId: string | null,
    actorId: string
  ) {
    const updated = await prisma.task.update({
      where: {
        id: taskId,
      },
      data: {
        assigneeId,
      },
      select: {
        id: true,
        project: { select: { workspaceId: true } },
      },
    });

    await writeTaskAuditLog({
      userId: actorId,
      workspaceId: updated.project.workspaceId,
      projectId,
      taskId,
      action: AuditActions.TASK_ASSIGNEE_CHANGED,
      details: { assigneeId },
    });

    return updated;
  }

  static async moveTask(
    taskId: number,
    sprintId: number | null,
    projectId: number,
    actorId: string
  ) {
    const current = await prisma.task.findUnique({
      where: { id: taskId },
      select: {
        title: true,
        projectId: true,
        sprintId: true,
        project: { select: { workspaceId: true } },
      },
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
    const updated = await prisma.task.update({
      where: {
        id: taskId,
      },
      data: {
        sprintId,
      },
    });

    await writeTaskAuditLog({
      userId: actorId,
      workspaceId: current.project.workspaceId,
      projectId,
      taskId,
      action: AuditActions.UPDATE,
      details: { fromSprint: current.sprintId, toSprint: sprintId },
    });

    return updated;
  }

  static async deleteTask(
    taskId: number,
    projectId: number,
    actorId: string
  ) {
    const task = await prisma.task.findUnique({
      where: { id: taskId },
      select: {
        projectId: true,
        title: true,
        project: { select: { workspaceId: true } },
      },
    });

    if (!task || task.projectId !== projectId) {
      throw new AppError(404, 'TASK_NOT_FOUND', 'Задача не найдена');
    }

    const deleted = await prisma.task.delete({
      where: { id: taskId },
    });

    await writeTaskAuditLog({
      userId: actorId,
      workspaceId: task.project.workspaceId,
      projectId,
      taskId,
      action: AuditActions.DELETE,
      details: { title: task.title },
    });

    return deleted;
  }
}

const writeTaskAuditLog = async ({
  userId,
  workspaceId,
  projectId,
  taskId,
  action,
  details,
}: {
  userId: string;
  workspaceId: number;
  projectId: number;
  taskId: number | string;
  action: AuditActions;
  details?: Record<string, unknown>;
}) => {
  await prisma.auditLog.create({
    data: {
      userId,
      workspaceId,
      projectId,
      action,
      entityType: 'TASK',
      entityId: String(taskId),
      details: details ? JSON.stringify(details) : null,
    },
  });
};
