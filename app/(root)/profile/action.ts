import { requireUser } from '@/helpers/require-user';
import prisma from '@/lib/prisma';
import { profileSchema } from '@/schemas/profile';

export const changeUserInfo = async (raw: unknown) => {
  const { id } = await requireUser();
  const res = profileSchema.safeParse(raw);
  if (!res.success) return { ok: false, errors: res.error.message };

  try {
    await prisma.user.update({
      where: { id },
      data: {
        firstName: res.data.firstName,
        lastName: res.data.lastName,
        image: res.data.img || null,
      },
    });
  } catch {
    return { ok: false };
  }

  return { ok: true };
};
