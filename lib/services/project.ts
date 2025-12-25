import {
  workspaceIdExistSchema,
  CreateProjectFormValues,
} from '@/schemas/projects/create-project-form-schemas';
import {
  CreatedAndCompletedTasksInPoint,
  ProjectCompletedTasksDTO,
  ProjectCompletedTaskVsCreatedDTO,
  ProjectListDTO,
  UserActivity,
} from '@/types/prisma/DTO/projects';
import { prisma } from '../prisma';
import logger from '../logger';
import { TaskStats } from '@/types/service/task-stats';
import { AuditActions, Prisma, TaskStatus } from '@prisma/client';
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
  static async createProject(
    raw: unknown,
    actorId?: string
  ): Promise<ProjectListDTO> {
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

    if (actorId) {
      await logProjectAudit({
        userId: actorId,
        workspaceId: project.workspaceId,
        projectId: project.id,
        action: AuditActions.CREATE,
        details: { name: project.name },
      });
    }

    return project;
  }

  static async toggleProjectEnd(
    projectId: number,
    actorId?: string,
    workspaceId?: number
  ) {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: { id: true, endedAt: true, workspaceId: true, name: true },
    });

    if (!project) {
      throw new AppError(404, 'PROJECT_NOT_FOUND', 'Проект не найден');
    }
    if (workspaceId && project.workspaceId !== workspaceId) {
      throw new AppError(404, 'PROJECT_NOT_FOUND', 'Проект не найден');
    }

    const nextEndedAt = project.endedAt ? null : new Date();

    const updated = await prisma.project.update({
      where: { id: projectId },
      data: {
        endedAt: nextEndedAt,
      },
      select: { id: true, endedAt: true, workspaceId: true, name: true },
    });

    if (actorId) {
      await logProjectAudit({
        userId: actorId,
        workspaceId: updated.workspaceId,
        projectId: updated.id,
        action: AuditActions.UPDATE,
        details: {
          event: project.endedAt ? 'PROJECT_REOPENED' : 'PROJECT_ENDED',
          name: updated.name,
        },
      });
    }

    return updated;
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

  static async updateProject(
    projectId: number,
    data: CreateProjectFormValues,
    actorId?: string
  ) {
    const before = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!before) {
      throw new AppError(404, 'PROJECT_NOT_FOUND', 'Проект не найден');
    }

    const updated = await prisma.project.update({
      where: { id: projectId },
      data: {
        name: data.name,
        description: data.description,
      },
    });

    if (actorId) {
      const renamed = before.name !== updated.name;
      await logProjectAudit({
        userId: actorId,
        workspaceId: updated.workspaceId,
        projectId: updated.id,
        action: renamed ? AuditActions.PROJECT_RENAMED : AuditActions.UPDATE,
        details: {
          before: { name: before.name, description: before.description },
          after: { name: updated.name, description: updated.description },
        },
      });
    }

    return updated;
  }

  static async deleteProject(projectId: number, actorId?: string) {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: { id: true, name: true, workspaceId: true },
    });

    if (!project) {
      throw new AppError(404, 'PROJECT_NOT_FOUND', 'Проект не найден');
    }

    const deleted = await prisma.project.delete({
      where: { id: projectId },
    });

    if (actorId) {
      await logProjectAudit({
        userId: actorId,
        workspaceId: project.workspaceId,
        action: AuditActions.DELETE,
        details: { name: project.name, projectId: project.id },
      });
    }

    return deleted;
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
    const [all, grouped, overdue, sprintsCount] = await Promise.all([
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
      prisma.sprint.count({
        where: { projectId },
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
      sprintsCount,
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
      sprintsCount: 0,
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

  static async getCompletedVsCreatedTasks(
    projectId: number,
    from: Date,
    to: Date,
    sprintId: number | null
  ): Promise<ProjectCompletedTaskVsCreatedDTO> {
    const tasks = await prisma.task.findMany({
      where: {
        projectId,
        OR: [
          { createdAt: { gte: from, lte: to } },
          { completedAt: { gte: from, lte: to } },
        ],
      },
      select: {
        id: true,
        status: true,
        createdAt: true,
        completedAt: true,
      },
    });

    const createdMap = new Map<string, number>();
    const completedMap = new Map<string, number>();

    const inc = (map: Map<string, number>, date: Date) => {
      const day = date.toISOString().split('T')[0];
      map.set(day, (map.get(day) || 0) + 1);
    };

    for (const task of tasks) {
      if (
        task.completedAt &&
        task.completedAt >= from &&
        task.completedAt <= to &&
        task.status === 'DONE'
      ) {
        inc(completedMap, task.completedAt);
      }
      if (
        task.createdAt &&
        task.createdAt >= from &&
        task.createdAt <= to &&
        task.completedAt === null &&
        task.status !== 'DONE'
      ) {
        inc(createdMap, task.createdAt);
      }
    }

    const merged = new Map<string, { created: number; completed: number }>();

    for (const [date, count] of completedMap) {
      const prev = merged.get(date) ?? { created: 0, completed: 0 };
      merged.set(date, {
        ...prev,
        completed: count,
      });
    }

    for (const [date, count] of createdMap) {
      const prev = merged.get(date) ?? { created: 0, completed: 0 };
      merged.set(date, {
        ...prev,
        created: count,
      });
    }

    const points: CreatedAndCompletedTasksInPoint[] = Array.from(
      merged.entries()
    )
      .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
      .map(([date, { created, completed }]) => ({
        date,
        created,
        completed,
      }));

    return {
      from: from.toISOString(),
      to: to.toISOString(),
      points: points,
      totals: {
        created: Array.from(createdMap.values()).reduce((a, b) => a + b, 0),
        completed: Array.from(completedMap.values()).reduce((a, b) => a + b, 0),
      },
    };
  }

  static async getUserActivity(
    projectId: number,
    from: Date,
    to: Date
  ): Promise<UserActivity> {
    const tasks = await prisma.task.findMany({
      where: {
        projectId,
        OR: [
          { createdAt: { gte: from, lte: to } },
          { completedAt: { gte: from, lte: to } },
        ],
      },
      select: {
        id: true,
        status: true,
        createdAt: true,
        completedAt: true,
        assignee: true,
      },
    });

    const map = new Map<
      string,
      { assigned: number; completed: number; user: string; userId: string }
    >();
    let noAssigneeTasks = 0;

    for (let i = 0; i < tasks.length; i++) {
      if (tasks[i].assignee === null) {
        noAssigneeTasks++;
        continue;
      }
      const task = map.get(tasks[i].assignee!.id);
      if (!task) {
        map.set(tasks[i].assignee!.id, {
          assigned: 1,
          completed: tasks[i].status === 'DONE' ? 1 : 0,
          user:
            tasks[i].assignee!.firstName + ' ' + tasks[i].assignee!.lastName,
          userId: tasks[i].assignee!.id,
        });
      } else {
        task.assigned++;
        if (tasks[i].status === 'DONE') {
          task.completed++;
        }
      }
    }

    return {
      from: from.toISOString(),
      to: to.toISOString(),
      points: Array.from(map.values()),
      noAssigneeTasks,
    };
  }

  static async getSLA(projectId: number) {
    // SLA % = (кол-во задач закрытых вовремя / кол-во задач с дедлайном) * 100
    const [totalTasksCount, completedTasksInDeadlineCount] = await Promise.all([
      prisma.task.count({
        where: { projectId },
      }),
      prisma.task.count({
        where: { projectId, status: 'DONE', completedAt: { lte: new Date() } },
      }),
    ]);
    logger.debug(
      `[ProjectService.getSLA] totalTasksCount=${totalTasksCount} completedTasksInDeadlineCount=${completedTasksInDeadlineCount}`
    );

    const SLA = (
      (completedTasksInDeadlineCount / totalTasksCount) *
      100
    ).toFixed(2);
    logger.debug(`[ProjectService.getSLA] SLA=${SLA}`);
    return {
      SLA,
      totalTasksCount,
      completedTasksInDeadlineCount,
    };
  }
}

//-----------------------------------------------------//
//----------------Audit Logging-----------------------//
//---------------------------------------------------//
const logProjectAudit = async ({
  userId,
  workspaceId,
  projectId,
  action,
  details,
}: {
  userId: string;
  workspaceId: number;
  projectId?: number;
  action: AuditActions;
  details?: Record<string, unknown>;
}) => {
  await prisma.auditLog.create({
    data: {
      userId,
      workspaceId,
      projectId: projectId ?? undefined,
      action,
      entityType: 'PROJECT',
      entityId: String(projectId),
      details: details ? JSON.stringify(details) : null,
    },
  });
};
