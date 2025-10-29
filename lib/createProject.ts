'use server';

import { requireUser } from '@/helpers/require-user';
import { workspaceIdExistSchema } from '@/schemas/projects/create-project-form-schemas';
import prisma from './prisma';

export const createProject = async (raw: unknown) => {
  await requireUser();
  const data = workspaceIdExistSchema.parse(raw);

  return prisma.project.create({
    data: {
      name: data.name,
      workspaceId: data.workspaceId,
      description: data.description,
    },
  });
};
