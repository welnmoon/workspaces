import type { Workspace } from '@prisma/client';

export type WorkspaceCreateDTO = Pick<Workspace, 'name' | 'description'>;

export type WorkspaceSelectDTO = Pick<Workspace, 'id' | 'name'>;

export type WorkspaceListDTO = Pick<
  Workspace,
  'id' | 'description' | 'name' | 'avatarUrl'
>;

export type WorkspaceUpdateDTO = Partial<
  Pick<Workspace, 'name' | 'description'>
>;

export type WorkspaceDeleteDTO = Pick<Workspace, 'id'>;

export type WorkspaceWithoutDatesDTO = Omit<
  Workspace,
  'createdAt' | 'updatedAt'
>;

export type WorkspaceDTO = Workspace;
