import { SprintTasksStatsDTO } from '@/types/prisma/DTO/sprint';
import { prisma } from '../prisma';

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
}
