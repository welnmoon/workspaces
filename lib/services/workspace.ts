import {
  WorkspaceListDTO,
  WorkspaceSelectDTO,
} from '@/types/prisma/DTO/workspaces';
import { prisma } from '../prisma';
import { createWorkspaceFormSchema } from '@/schemas/workspace/create-workspace-form-schema';
import { Workspace } from '@prisma/client';
import { MembershipSelectUserDTO } from '@/types/prisma/DTO/memberships';

export class WorkspaceService {
  // Получение списка воркспейсов
  static async getList(userId: string): Promise<WorkspaceListDTO[]> {
    return prisma.workspace.findMany({
      where: {
        memberships: {
          some: { userId },
        },
      },
      select: {
        id: true,
        name: true,
        description: true,
        avatarUrl: true,
      },
    });
  }

  static async getWorkspaceProjects(workspaceId: number) {
    return prisma.project.findMany({
      where: {
        workspaceId,
      },
    });
  }

  static async getProjectsCount(workspaceId: number): Promise<number> {
    return prisma.project.count({
      where: {
        workspaceId,
      },
    });
  }

  // Получение данных для селекта
  static async getSelect(userId: string): Promise<WorkspaceSelectDTO[]> {
    return prisma.workspace.findMany({
      where: {
        memberships: {
          some: { userId },
        },
      },
      select: {
        id: true,
        name: true,
      },
    });
  }

  // Создание воркспейса
  static async create({ raw, userId }: { raw: unknown; userId: string }) {
    const data = createWorkspaceFormSchema.parse(raw);
    return prisma.workspace.create({
      data: {
        ...data,
        ownerId: userId,
      },
      select: {
        id: true,
        name: true,
        description: true,
      },
    });
  }

  static async getWorkspaceById(
    workspaceId: number
  ): Promise<Workspace | null> {
    return prisma.workspace.findUnique({
      where: {
        id: workspaceId,
      },
    });
  }

  static async getWorkspaceName(workspaceId: number) {
    return prisma.workspace.findUnique({
      where: {
        id: workspaceId,
      },
      select: {
        name: true,
      },
    });
  }

  static async getWorkspaceMembers(
    workspaceId: number
  ): Promise<MembershipSelectUserDTO[]> {
    return prisma.membership.findMany({
      where: {
        workspaceId,
      },
      include: {
        user: true,
      },
    });
  }
}
