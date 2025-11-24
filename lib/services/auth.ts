import { PasswordChangeSchemaDTO } from '@/schemas/auth/passwrod-change-schema';
import { prisma, TxClient } from '../prisma';
import bcrypt from 'bcrypt';
import { AppError } from '../errors';
import { UserService } from './user';
import { ProviderId } from '../providers';

export class AuthService {
  static async updatePassword(dto: PasswordChangeSchemaDTO, userId: string) {
    const { currentPassword, newPassword } = dto;

    if (currentPassword === newPassword)
      throw new AppError(
        400,
        'PASSWORD_NOT_CHANGED',
        'Пароль совпадает со старым'
      );

    const DbCurrentPassword = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        password: true,
      },
    });

    if (!DbCurrentPassword?.password)
      throw new AppError(400, 'PASSWORD_NOT_SET', 'У пользователя нет пароля');

    const isCorrect = await bcrypt.compare(
      currentPassword,
      DbCurrentPassword.password
    );

    if (!isCorrect) {
      throw new AppError(400, 'INCORRECT_PASSWORD', 'Неверный пароль');
    }

    const isIdentical = await bcrypt.compare(
      newPassword,
      DbCurrentPassword.password
    );

    if (isIdentical)
      throw new AppError(
        400,
        'PASSWORD_NOT_CHANGED',
        'Пароль совпадает со старым'
      );

    const newHashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        password: newHashedPassword,
      },
    });
  }

  static async deleteUsersAccount(id: string, provider: ProviderId) {
    // Есть ли такой аккаунт у пользователя?
    const account = await prisma.account.findUnique({
      where: {
        userId_provider: {
          userId: id,
          provider,
        },
      },
      select: {
        provider: true,
        id: true,
      },
    });

    if (!account)
      throw new AppError(404, 'ACCOUNT_NOT_FOUND', 'Аккаунт не найден');

    // пароль есть?
    const user = await UserService.getUserByIdSelectPassword(id);
    if (!user)
      throw new AppError(400, 'USER_NOT_FOUND', 'Пользователь не найден');

    const hasPassword = user.password !== null && user.password !== '';

    await prisma.$transaction(async (tx: TxClient) => {
      await tx.$executeRawUnsafe(
        `SELECT 1 FROM "User" WHERE id = $1 FOR UPDATE`,
        id
      );

      const totalAccounts = await tx.account.count({
        where: { userId: id },
      });

      if (!hasPassword && totalAccounts <= 1)
        throw new AppError(
          400,
          'DELETE_LAST_ACCOUNT',
          'Нельзя удалить последний аккаунт без пароля'
        );

      await tx.account.delete({
        where: {
          userId_provider: {
            userId: id,
            provider,
          },
        },
      });

      
    });
  }
}
