import { SprintTasksStatsDTO } from '@/types/prisma/DTO/sprint';
import { prisma } from '../prisma';
import { Prisma, SprintColor } from '@prisma/client';
import { ensureProjectActive } from '@/guards/ensure-project-active';
import { AppError } from '../errors';
import { UpdateSprintFormValues } from '@/schemas/sprint/update-sprint-schema';

export class SprintService {
  static async getProjectSprints(projectId: number) {
    return await prisma.sprint.findMany({
      where: {
        projectId,
      },
    });
  }

  static async getProjectSprintsWithTasks(projectId: number) {
    return await prisma.sprint.findMany({
      where: {
        projectId,
      },
      include: {
        tasks: {
          include: {
            assignee: true,
          },
        },
      },
      orderBy: {
        startDate: 'asc',
      },
    });
  }

  static async changeSprintDates({
    sprintId,
    projectId,
    startDate,
    endDate,
  }: {
    sprintId: number;
    projectId: number;
    startDate: Date | null;
    endDate: Date | null;
  }) {
    await ensureProjectActive(projectId);
    return prisma.sprint.update({
      where: {
        id: sprintId,
        projectId,
      },
      data: {
        startDate,
        endDate,
      },
    });
  }

  static async createSprint({
    projectId,
    name,
    goal,
    startDate,
    endDate,
  }: {
    projectId: number;
    name: string;
    goal?: string | null;
    startDate?: Date | null;
    endDate?: Date | null;
  }) {
    await ensureProjectActive(projectId);
    return await prisma.sprint.create({
      data: {
        name,
        projectId,
        goal: goal ?? null,
        startDate: startDate ?? null,
        endDate: endDate ?? null,
      },
    });
  }

  static async getSprintTasksStats(
    sprintId: number
  ): Promise<SprintTasksStatsDTO> {
    const [all, grouped, overdue] = await Promise.all([
      prisma.task.count({ where: { sprintId } }),
      prisma.task.groupBy({
        by: ['status'],
        where: { sprintId },
        _count: true,
      }),
      prisma.task.count({
        where: {
          sprintId,
          dueDate: { lt: new Date() },
        },
      }),
    ]);

    const statusCounts: Record<
      'TODO' | 'IN_PROGRESS' | 'DONE' | 'BLOCKED',
      number
    > = {
      TODO: 0,
      IN_PROGRESS: 0,
      DONE: 0,
      BLOCKED: 0,
    };

    for (const item of grouped) {
      statusCounts[item.status as keyof typeof statusCounts] = item._count;
    }

    return {
      tasksCount: all,
      tasksToDoCount: statusCounts.TODO,
      tasksInProgressCount: statusCounts.IN_PROGRESS,
      tasksDoneCount: statusCounts.DONE,
      tasksBlockedCount: statusCounts.BLOCKED,
      tasksOverdueCount: overdue,
    };
  }

  static async changeColor(color: SprintColor, sprintId: number) {
    const sprint = await prisma.sprint.findUnique({
      where: { id: sprintId },
      select: { projectId: true },
    });

    if (!sprint) {
      throw new AppError(404, 'SPRINT_NOT_FOUND', 'Спринт не найден');
    }

    await ensureProjectActive(sprint.projectId);

    return prisma.sprint.update({
      where: { id: sprintId },
      data: { color },
    });
  }

  static async getSprintsForUser(userId: string) {
    return prisma.sprint.findMany({
      where: {
        project: {
          workspace: {
            memberships: {
              some: { userId },
            },
          },
        },
      },
      select: {
        id: true,
        name: true,
        goal: true,
        startDate: true,
        endDate: true,
        color: true,
        projectId: true,
        createdAt: true,
        updatedAt: true,
        project: {
          select: {
            id: true,
            name: true,
            workspace: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        tasks: {
          select: {
            id: true,
            title: true,
            status: true,
            dueDate: true,
            assignee: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
      orderBy: {
        startDate: 'desc',
      },
    });
  }

  static async getSprintWithRelations(sprintId: number) {
    return prisma.sprint.findUnique({
      where: { id: sprintId },
      include: {
        project: {
          select: {
            id: true,
            name: true,
            workspaceId: true,
            workspace: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });
  }

  static async updateSprintFromAdmin(
    sprintId: number,
    data: UpdateSprintFormValues
  ) {
    const sprint = await prisma.sprint.findUnique({
      where: { id: sprintId },
      select: {
        projectId: true,
      },
    });

    if (!sprint) {
      throw new AppError(404, 'SPRINT_NOT_FOUND', 'Спринт не найден');
    }

    await ensureProjectActive(sprint.projectId);

    const payload: Prisma.SprintUpdateInput = {};

    const parseDate = (value: string | null) => {
      if (value === null) return null;
      const parsed = new Date(value);
      if (Number.isNaN(parsed.getTime())) {
        throw new AppError(400, 'INVALID_DATE', 'Укажите корректную дату');
      }
      return parsed;
    };

    if (data.name !== undefined) payload.name = data.name;
    if (data.goal !== undefined) payload.goal = data.goal;

    if (data.startDate !== undefined) {
      payload.startDate =
        data.startDate === null ? null : parseDate(data.startDate);
    }

    if (data.endDate !== undefined) {
      payload.endDate =
        data.endDate === null ? null : parseDate(data.endDate);
    }

    if (data.color !== undefined) payload.color = data.color;

    return prisma.sprint.update({
      where: { id: sprintId },
      data: payload,
    });
  }

  static async deleteSprint(sprintId: number) {
    const sprint = await prisma.sprint.findUnique({
      where: { id: sprintId },
      select: { projectId: true },
    });

    if (!sprint) {
      throw new AppError(404, 'SPRINT_NOT_FOUND', 'Спринт не найден');
    }

    await ensureProjectActive(sprint.projectId);

    return prisma.sprint.delete({
      where: { id: sprintId },
    });
  }
}
