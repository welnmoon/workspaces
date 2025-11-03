import { PasswordChangeSchemaDTO } from '@/schemas/auth/passwrod-change-schema';
import prisma from '../prisma';
import bcrypt from 'bcrypt';
import { AppError } from '../errors';

export class AuthService {
  static async updatePassword(dto: PasswordChangeSchemaDTO, userId: string) {
    const { currentPassword, newPassword } = dto;

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
}
