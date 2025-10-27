'use server';

import { requireUser } from '@/helpers/require-user';
import { workspaceIdExistSchema } from '@/schemas/projects/create-project-form-schemas';
import prisma from './prisma';
import z from 'zod';

export const createProject = async (raw: unknown) => {
  const { id } = await requireUser();
  const res = workspaceIdExistSchema.safeParse(raw);
  if (!res.success) return { ok: false, errors: res.error.message };

  try {
    await prisma.project.create({
      data: {
        name: res.data.name,
        workspaceId: res.data.workspaceId,
        description: res.data.description,
      },
    });
    return { ok: true };
  } catch (e) {
    return { ok: false, errors: 'Failed to create project' };
  }
};
