import { profileSchema } from '@/schemas/profile/profile';
import prisma from '../prisma';
import { UserProfileDTO } from '@/types/prisma/DTO/user';

export class UserService {
  static async getUserById(userId: string) {
    return await prisma.user.findUnique({
      where: {
        id: userId,
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
    return await prisma.user.update({
      where: {
        id: userId,
      },
      data: res,
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
}
