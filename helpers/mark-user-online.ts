import { AppError } from '@/lib/errors';
import { UserService } from '@/lib/services/user';

const ONLINE_UPDATE_INTERVAL_MS = 5 * 60 * 1000;

export const markUserOnline = async (userId: string) => {
  const user = await UserService.getUserById(userId);

  if (!user) throw new AppError(404, 'USER_NOT_FOUND', 'User not found');

  const now = Date.now();

  if (!user.wasOnline) {
    await UserService.updateUserWasOnline(userId, new Date(now));
    return;
  }

  const lastOnline = user.wasOnline.getTime();

  if (now - lastOnline < ONLINE_UPDATE_INTERVAL_MS) {
    return;
  }

  await UserService.updateUserWasOnline(userId, new Date(now));
};
