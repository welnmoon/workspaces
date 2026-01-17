import { profileSchema } from '@/schemas/profile/profile';
import { UserProfileDTO } from '@/types/prisma/DTO/user';
import { prisma } from '../prisma';
import { Tariff } from '@prisma/client';
import { tariffs } from '@/const/tariffs';
import bcrypt from 'bcrypt';

export class UserService {
  static async getUserById(userId: string) {
    return await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
  }

  static async getUserTariff(userId: string) {
    return await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        currentTariff: true,
      },
    });
  }

  static async getUserByIdSelectPassword(userId: string) {
    return await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        password: true,
      },
    });
  }

  static async getUserProfile(userId: string): Promise<UserProfileDTO | null> {
    return await prisma.user.findUnique({
      where: { id: userId },
      include: {
        accounts: true,
        memberships: { include: { workspace: true } },
      },
    });
  }

  static async getUserByEmail(email: string) {
    return await prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  static async createUser(email: string, password: string) {
    return await prisma.user.create({
      data: {
        email,
        password,
      },
    });
  }

  static async updateUser(userId: string, data: unknown) {
    const res = profileSchema.parse(data);
    const {
      password,
      confirmPassword: _confirmPassword,
      avatarUrl,
      img,
      image,
      ...rest
    } = res;

    const updateData: Record<string, unknown> = { ...rest };

    const resolvedImage = avatarUrl ?? img ?? image;
    if (resolvedImage !== undefined) {
      updateData.image =
        typeof resolvedImage === 'string' && resolvedImage.trim() === ''
          ? null
          : resolvedImage;
    }

    if (typeof updateData.email === 'string' && updateData.email.trim() === '') {
      updateData.email = null;
    }

    if (typeof updateData.firstName === 'string' && updateData.firstName.trim() === '') {
      updateData.firstName = null;
    }

    if (typeof updateData.lastName === 'string' && updateData.lastName.trim() === '') {
      updateData.lastName = null;
    }

    if (typeof password === 'string' && password.trim() !== '') {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.password = hashedPassword;
    }

    return await prisma.user.update({
      where: {
        id: userId,
      },
      data: updateData,
    });
  }


  static async deleteUser(userId: string) {
    return await prisma.user.delete({
      where: {
        id: userId,
      },
    });
  }

  static async getUsers() {
    return await prisma.user.findMany({
      select: {
        id: true,
        firstName: true,
        email: true,
        lastName: true,
        wasOnline: true,
      },
    });
  }

  static async updateUserWasOnline(userId: string, date: Date) {
    return await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        wasOnline: date,
      },
    });
  }

  static async verifyUser(email: string) {
    return await prisma.user.update({
      where: {
        email,
      },
      data: {
        emailVerified: new Date(),
      },
    });
  }

  static async updateUserTariff(userId: string, tariff: Tariff) {
    const amount = tariffs[tariff]?.amount ?? 0;

    return prisma.$transaction(async (tx) => {
      const payment = await tx.payment.create({
        data: {
          userId,
          tariff,
          amount,
          currency: 'KZT',
          status: 'COMPLETED',
          paidAt: new Date(),
        },
      });

      await tx.user.update({
        where: { id: userId },
        data: { currentTariff: tariff },
      });

      return payment;
    });
  }

  static async getUserPayments(userId: string) {
    return prisma.payment.findMany({
      where: { userId },
      orderBy: [{ paidAt: 'desc' }, { createdAt: 'desc' }],
    });
  }

  static async getUserCompletedTasks(userId: string) {
    return prisma.task.findMany({
      where: {
        assigneeId: userId,
        status: 'DONE',
      },
      select: {
        id: true,
        title: true,
        completedAt: true,
        project: {
          select: {
            id: true,
            name: true,
            workspace: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: [{ completedAt: 'desc' }, { id: 'desc' }],
    });
  }
}
