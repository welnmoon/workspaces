import { workspaceIdExistSchema } from '@/schemas/projects/create-project-form-schemas';
import { ProjectListDTO } from '@/types/prisma/DTO/projects';
import prisma from '../prisma';

export class ProjectServices {
  static async getList(workspaceId: number) {
    return prisma.project.findMany({
      where: {
        workspaceId,
      },
    });
  }
  static async createProject(raw: unknown): Promise<ProjectListDTO> {
    const data = workspaceIdExistSchema.parse(raw);

    return prisma.project.create({
      data: {
        name: data.name,
        workspaceId: data.workspaceId,
        description: data.description,
      },
    });
  }

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
}
