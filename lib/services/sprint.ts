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
}
