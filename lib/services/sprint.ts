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

  static async createSprint(projectId: number, name: string) {
    return await prisma.sprint.create({
      data: {
        name,
        projectId,
      },
    });
  }
}
