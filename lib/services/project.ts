import {
  workspaceIdExistSchema,
  CreateProjectFormValues,
} from '@/schemas/projects/create-project-form-schemas';
import {
  ProjectCompletedTasksDTO,
  ProjectListDTO,
} from '@/types/prisma/DTO/projects';
import { prisma } from '../prisma';
import logger from '../logger';
import { TaskStats } from '@/types/service/task-stats';
import { Prisma, TaskStatus } from '@prisma/client';
import { AppError } from '../errors';
import { endOfDay, startOfDay, subMonths } from 'date-fns';

export class ProjectService {
  //-------------------------------------//
  //--------- CRUD ---------------//
  //-------------------------------------//

  static async getProjects(workspaceId: number) {
    return prisma.project.findMany({
      where: {
        workspaceId,
      },
    });
  }

  static async getProjectName(projectId: number) {
    return prisma.project.findUnique({
      where: {
        id: projectId,
      },
      select: {
        name: true,
      },
    });
  }
  static async createProject(raw: unknown): Promise<ProjectListDTO> {
    const data = workspaceIdExistSchema.parse(raw);

    const exists = await prisma.project.findFirst({
      where: {
        workspaceId: data.workspaceId,
        name: { equals: data.name, mode: 'insensitive' },
      },
      select: { id: true },
    });

    if (exists) {
      throw new AppError(
        409,
        'PROJECT_ALREADY_EXISTS',
        'Проект с таким названием уже есть в рабочем пространстве'
      );
    }

    const project = await prisma.$transaction(async (tx) => {
      const project = await tx.project.create({
        data: {
          name: data.name,
          workspaceId: data.workspaceId,
          description: data.description,
        },
      });

      await tx.sprint.create({
        data: {
          name: 'Спринт 1',
          projectId: project.id,
        },
      });

      return project;
    });

    return project;
  }

  static async getProjectById(projectId: number) {
    return prisma.project.findUnique({
      where: { id: projectId },
    });
  }

  static async getProjectByIdWithWorkspace(projectId: number) {
    return prisma.project.findUnique({
      where: { id: projectId },
      include: {
        workspace: true,
      },
    });
  }

  static async updateProject(projectId: number, data: CreateProjectFormValues) {
    return prisma.project.update({
      where: { id: projectId },
      data: {
        name: data.name,
        description: data.description,
      },
    });
  }

  static async deleteProject(projectId: number) {
    return prisma.project.delete({
      where: { id: projectId },
    });
  }

  static async isProjectInWorkspace(
    projectId: number,
    workspaceId: number
  ): Promise<boolean> {
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        workspaceId: workspaceId,
      },
    });
    return !!project;
  }

  static async getProjectTasks(
    projectId: number
    // filters?: TaskFilters
  ) {
    const where: Prisma.TaskWhereInput = {
      projectId: projectId,
    };

    // if (filters?.status) where.status = filters.status;
    // if (filters?.done) where.done = filters.done;
    // if (filters?.todo) where.todo = filters.todo;
    // if (filters?.inProgress) where.inProgress = filters.inProgress;
    // if (filters?.overdue) where.overdue = filters.overdue;
    // if (filters?.fromDate) where.dueDate = { gte: filters.fromDate };
    // if (filters?.toDate) where.dueDate = { lte: filters.toDate };
    // if (filters?.assigneeId) where.assigneeId = filters.assigneeId;

    return prisma.task.findMany({
      where,
      orderBy: {
        dueDate: 'asc',
      },
    });
  }

  static async getProjectTasksWithAssignee(projectId: number) {
    const where: Prisma.TaskWhereInput = { projectId };

    return prisma.task.findMany({
      where,
      include: {
        assignee: true,
      },
      orderBy: {
        dueDate: 'asc',
      },
    });
  }

  static async getProjectSprints(projectId: number) {
    return prisma.sprint.findMany({
      where: { projectId },
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

  static async getProjectSprintTasks(projectId: number, sprintId: number) {
    return prisma.task.findMany({
      where: {
        projectId,
        sprintId,
      },
      include: {
        assignee: true,
      },
      orderBy: {
        dueDate: 'asc',
      },
    });
  }

  //-------------------------------------//
  //--------- For sidebar ---------------//
  //-------------------------------------//

  static async getSelect(userId: string) {
    return prisma.project.findMany({
      where: {
        workspace: {
          memberships: {
            some: {
              userId,
            },
          },
        },
      },
      select: {
        id: true,
        name: true,
      },
    });
  }

  //-------------------------------------//
  //--------- TASKS COUNT ---------------//
  //-------------------------------------//
  static async getProjectTasksStats(projectId: number): Promise<TaskStats> {
    const [all, grouped, overdue] = await Promise.all([
      prisma.task.count({
        where: { projectId },
      }),
      prisma.task.groupBy({
        by: ['status'],
        where: { projectId },
        _count: true,
      }),
      prisma.task.count({
        where: {
          projectId,
          dueDate: {
            lt: new Date(),
          },
        },
      }),
    ]);

    const statusCounts: Record<TaskStatus, number> = {
      TODO: 0,
      IN_PROGRESS: 0,
      DONE: 0,
      BLOCKED: 0,
    };

    for (const item of grouped) {
      statusCounts[item.status as TaskStatus] = item._count;
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

  static async getProjectMemberTasksStats(
    projectId: number,
    memberId: string
  ): Promise<TaskStats> {
    const [all, grouped, overdue] = await Promise.all([
      prisma.task.count({
        where: { projectId, assigneeId: memberId },
      }),
      prisma.task.groupBy({
        by: ['status'],
        where: { projectId, assigneeId: memberId },
        _count: true,
      }),
      prisma.task.count({
        where: {
          projectId,
          assigneeId: memberId,
          dueDate: {
            lt: new Date(),
          },
        },
      }),
    ]);

    const statusCounts: Record<TaskStatus, number> = {
      TODO: 0,
      IN_PROGRESS: 0,
      DONE: 0,
      BLOCKED: 0,
    };

    for (const item of grouped) {
      statusCounts[item.status as TaskStatus] = item._count;
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

  // --------------------------------------------//
  // -----------------Analytics-----------------//
  // --------------------------------------------//

  static async getCompletedTasks(
    projectId: number,
    from?: Date,
    to?: Date
  ): Promise<ProjectCompletedTasksDTO[]> {
    const start = startOfDay(from ?? subMonths(new Date(), 1));
    const end = endOfDay(to ?? new Date());
    logger.debug(
      `[ProjectService.getCompletedTasks] project=${projectId} range ${start.toISOString()} -> ${end.toISOString()}`
    );

    const tasks = await prisma.task.findMany({
      where: {
        projectId,
        status: 'DONE',
        completedAt: {
          gte: start,
          lte: end,
        },
      },
      select: {
        completedAt: true,
      },
    });
    logger.debug(
      `[ProjectService.getCompletedTasks] raw completed records=${tasks.length}`
    );

    const byDate = tasks.reduce<Record<string, number>>((acc, t) => {
      if (!t.completedAt) return acc;
      const dateKey = t.completedAt.toISOString().split('T')[0];
      acc[dateKey] = (acc[dateKey] || 0) + 1;
      return acc;
    }, {});
    logger.debug(
      `[ProjectService.getCompletedTasks] grouped=${JSON.stringify(byDate)}`
    );

    return Object.entries(byDate).map(([date, count]) => ({
      date,
      count,
    }));
  }
}
