import type { Project } from '@prisma/client';

export type ProjectCreateDTO = Pick<
  Project,
  'name' | 'description' | 'workspaceId' 
>;

export type ProjectSelectDTO = Pick<Project, 'id' | 'name'>;

export type ProjectListDTO = Pick<
  Project,
  'id' | 'name' | 'description' | 'workspaceId'
>;

export type ProjectFullDTO = Pick<
  Project,
  'id' | 'name' | 'description' | 'workspaceId' | 'createdAt' | 'updatedAt'
>;

export type ProjectUpdateDTO = Partial<Pick<Project, 'name' | 'description'>>;

export type ProjectDeleteDTO = Pick<Project, 'id'>;

export type ProjectWithoutDatesDTO = Omit<Project, 'createdAt' | 'updatedAt'>;
